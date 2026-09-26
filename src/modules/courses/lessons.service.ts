import { AppError } from "../../common/errors/AppErrors"
import { prisma } from "../../config/prisma"
import { Language } from "../../generated/prisma/enums"
import { CreateLessonInput , UpdateLessonInput } from "./lessons.schema"
import fs from "fs/promises";
import path from "path";

export const createLessonService = async (sectionId: number , userId: number , data: CreateLessonInput) => {
    const teacher = await prisma.teacher.findUnique({
        where: {
            userId
        }
    })

    if(!teacher){
        throw new AppError(
            "teacher profile not found",
            404
        )
    }

    const section = await prisma.section.findUnique({
        where: {
            id: sectionId
        },
        select: {
            id: true,
            course: {
                select: {
                    teacherId: true
                }
            }
        }
    })

    if(!section){
        throw new AppError(
            "Section not found",
            404
        )
    }

    if(section.course.teacherId !== teacher.id){
        throw new AppError(
            "you do not have permission to modify this section",
            403
        )
    }

    const lesson = await prisma.lesson.create({
        data: {
            duration: data.duration,
            order: data.order,
            sectionId,
            translations: {
                create: data.translations.map((translation)=> ({
                    language: translation.language,
                    title: translation.title
                }))
            }
        },
        include: {
            translations: true
        }
    })

    return lesson
}


export const updateLessonService = async (lessonId:number , userId:number , data: UpdateLessonInput ) => {
    const teacher = await prisma.teacher.findUnique({
        where: {
            userId
        }
    })

    if(!teacher){
        throw new AppError(
            "teacher profile not found",
            404
        )
    }

    const lessons = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        include: {
            section: {
                include: {
                    course: true
                }
            }
        }
    })

    if(!lessons){
        throw new AppError(
            "Lesson not found",
            404
        )
    }

    if (lessons.section.course.teacherId !== teacher.id){
        throw new AppError(
            "you do not permission to modify this lesson",
            403
        )
    }

    const updatedLesson = await prisma.lesson.update({
        where: {
            id: lessonId
        },
        data:{
            ...(data.duration !== undefined && {
                duration: data.duration
            }),

            ...(data.order !== undefined && {
                order: data.order
            }),

            ...(data.translations !== undefined && {
                translations: {
                    upsert: data.translations.map((translation) => ({
                        where: {
                            lessonId_language: {
                                lessonId,
                                language: translation.language
                            }
                        },

                        update: {
                            title: translation.title
                        },

                        create: {
                            language: translation.language,
                            title: translation.title
                        }
                    }))
                }
            })
        },

        include: {
            translations: true
        }
    })

    return updatedLesson
}



export const deleteLessonService = async (lessonId:number , userId: number) => {
    const teacher = await prisma.teacher.findUnique({
        where: {
            userId
        }
    })

    if(!teacher){
        throw new AppError(
            "Teacher profile not found",
            404
        )
    }

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        include: {
            section: {
                include: {
                    course: true
                }
            }
        }
    })

    if(!lesson){
        throw new AppError(
            "Lesson not found",
            404
        )
    }

    if(lesson.section.course.teacherId !== teacher.id){
        throw new AppError(
            "you do not permission to delete this lesson",
            403
        )
    }

    await prisma.lesson.delete({
        where: {
            id: lessonId
        }
    })
}


export const getLessonById = async (lessonId: number , courseId: number, lang: Language= Language.FA) => {
    
    const lesson = await prisma.lesson.findFirst({
        where: {
            id: lessonId,
            section: {
                courseId
            }
        },
        include:{
            translations: {
                where: {
                    language: lang
                }
            }
        }
    })

    if(!lesson){
        throw new AppError(
            "Lesson not found",
            404
        )
    }

    const translation = lesson.translations[0]

    return{
        id: lesson.id,
        duration: lesson.duration,
        order: lesson.order,
        sectionId: lesson.sectionId,
        title: translation?.title ?? "",
        createdAt: lesson.createdAt
    }
}


export const uploadLessonFile = async (
  lessonId: number,
  userId: number,
  file: Express.Multer.File
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      section: {
        include: {
          course: {
            include: {
              teacher: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    throw new AppError(
      "Lesson not found",
      404
    );
  }

  if (lesson.section.course.teacher.userId !== userId) {
    throw new AppError(
      "You are not allowed to modify this lesson",
      403
    );
  }

  const fileUrl = `/uploads/lessons/${file.filename}`;

  const lessonFile = await prisma.lessonFile.create({
    data: {
      fileName: file.originalname,
      fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
      lessonId,
    },
  });

  return lessonFile;
};


export const getLessonFiles = async ( lessonId: number) => {

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId
    }
  });

  if (!lesson) {
    throw new AppError(
      "Lesson not found",
      404
    );
  }

  const files = await prisma.lessonFile.findMany({
    where: {
      lessonId
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return files;
};


export const deleteLessonFile = async (
  lessonId: number,
  fileId: number,
  userId: number
) => {
  const file = await prisma.lessonFile.findFirst({
    where: {
      id: fileId,
      lessonId,
    },
    include: {
      lesson: {
        include: {
          section: {
            include: {
              course: {
                include: {
                  teacher: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!file) {
    throw new AppError(
      "Lesson file not found",
      404
    );
  }

  if (file.lesson.section.course.teacher.userId !== userId) {
    throw new AppError(
      "You are not allowed to delete this file",
      403
    );
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    file.fileUrl
  );

  try {
    await fs.unlink(filePath);
  } catch {
    // File does not exist on disk
  }

  await prisma.lessonFile.delete({
    where: {
      id: fileId,
    },
  });

  return file;
};


export const getLessonFileForDownload = async (
    lessonId: number,
    fileId: number
) => {
    const file = await prisma.lessonFile.findFirst({
        where: {
            id: fileId,
            lessonId
        }
    });

    if (!file) {
        throw new AppError("Lesson file not found", 404);
    }

    return file;
};
