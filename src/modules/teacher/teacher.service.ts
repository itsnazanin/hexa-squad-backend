import { AppError } from "../../common/errors/AppErrors"
import { prisma } from "../../config/prisma"
import { Language } from "../../generated/prisma/enums"
import fs from "fs/promises"
import path from "path"



type TeacherTranslationInput = {
    language: Language
    name: string
    bio: string
}

type CreateTeacherInput = {
    translations: TeacherTranslationInput[]
    avatar: string
}

type UpdateTeacherInput = {
    translations?: TeacherTranslationInput[]
    avatar?: string
}

export const becomeTeacherService = async (userId: number , data: CreateTeacherInput) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(!user){
        throw new AppError(
            "User not found",
            404
        )
    }

    const existingTeacher = await prisma.teacher.findUnique({
        where: {
            userId
        }
    })

    if(existingTeacher){
        throw new AppError(
            "User is already existed as a teacher",
            400
        )
    }

    const result = await prisma.$transaction(async (tx) => {

    const updatedUser = await tx.user.update({
        where: {
            id: userId
        },
        data: {
            role: "TEACHER"
        }
    });

    const teacher = await tx.teacher.create({
        data: {
            userId,
            avatar: data.avatar,
            translations: {
                create: data.translations.map((translation) => ({
                    language: translation.language,
                    name: translation.name,
                    bio: translation.bio
                }))
            }
        },
        include: {
            translations: true
        }
    });

    return teacher;
});

  return result

}


export const getMyTeacherProfileService = async (userId: number, lang: Language = Language.FA) => {

    const teacher = await prisma.teacher.findUnique({
        where: {
            userId
        },
        include: {
            translations: {
                where: {
                    language: lang
                }
            }
        }
    })

    if(!teacher){
        throw new AppError(
            "Teacher profile not found",
            404
        )
    }

    const translation = teacher.translations[0]

    return {
        id:teacher.id,
        userId: teacher.userId,
        avatar: teacher.avatar,
        name: translation?.name ?? "",
        bio: translation?.bio ?? "",
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
    }
}


export const updateTeacher = async (userId: number , data: UpdateTeacherInput) => {
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

    const updatedTeacher = await prisma.teacher.update({
        where: {
            userId
        },
        data: {
            ...(data.avatar !== undefined && {
                avatar: data.avatar
            }),

            ...(data.translations !== undefined && {
                translations: {
                    upsert: data.translations.map((translation) => ({
                        where: {
                            teacherId_language: {
                                teacherId: teacher.id,
                                language: translation.language
                            }
                        },
                        update: {
                            name: translation.name,
                            bio: translation.bio
                        },
                        create: {
                            language: translation.language,
                            name: translation.name,
                            bio:translation.bio
                        }
                    }))
                }
            })
        },
        include: {
            translations:true
        }
    })

    return updatedTeacher
}


export const getTeachersService = async (search?: string, lang: Language = Language.FA) => {
    const teachers = await prisma.teacher.findMany({
        where: search
        ? {
           translations: {
            some: {
                language: lang,
                name: {
                    contains: search,
                    mode: "insensitive" as const
                }
            }
           }
        } : {},
        orderBy: {
            id: "asc"
        },
        select: {
            id: true,
            avatar:true,
            translations: {
                where: {
                    language: lang
                }
            }
        }
    })

    return teachers.map((teacher) => {
        const translation = teacher.translations[0]

        return {
            id:teacher.id,
            avatar: teacher.avatar,
            name: translation?.name ?? "",
            bio: translation?.bio ?? ""
        }
    })
}


export const uploadAvatar = async (
  teacherId: number,
  file: Express.Multer.File
) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId,
    },
  });

  if (!teacher) {
    throw new AppError("Teacher not found" , 404);
  }

  if (teacher.avatar) {
    const oldAvatarPath = path.join(
      process.cwd(),
      "src",
      teacher.avatar
    );

    try {
      await fs.unlink(oldAvatarPath);
    } catch {
     
    }
  }

  const avatarPath = `/uploads/teachers/${file.filename}`;

  const updatedTeacher = await prisma.teacher.update({
    where: {
      id: teacherId,
    },

    data: {
      avatar: avatarPath,
    },
  });

  return updatedTeacher;
};

export const deleteAvatar = async (teacherId: number) => {
    if(!teacherId){
        throw new AppError(
            "Invalid teacher ID",
            400
        )
    }

    const teacher = await prisma.teacher.findUnique({
        where: {
            id: teacherId
        }
    })

    if(!teacher){
        throw new AppError(
            "teacher not found",
            404
        )
    }

    if(!teacher.avatar){
        throw new AppError(
            "teacher has no avatar",
            400
        )
    }

    const avatarPath = path.join(
        process.cwd(),
        "src",
        teacher.avatar.replace(/^\/+/, "")
    )

    try{
        await fs.unlink(avatarPath)
    }catch{
        // file does not exist on disk
    }

    const updatedTeacher = await prisma.teacher.update({
        where: {
            id: teacherId
        },
        data:{
            avatar: null
        }
    })

    return updatedTeacher
}