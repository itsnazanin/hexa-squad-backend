import { AppError } from "../../common/errors/AppErrors"
import { prisma } from "../../config/prisma"
import { Language } from "../../generated/prisma/enums";
import { createCourseDataType } from "./courses.schema"
import fs from "fs/promises"
import path from "path"


type UpdateCourseInput = {
    translations?: {
        language: "FA" | "EN";
        title: string;
        shortDescription: string;
        description: string;
    }[];
    status?: "PENDING" | "COMPLETED";
    startDate?: Date | null;
    endDate?: Date | null;
    courseTime?: number;
    price?: number;
    categoryId?: number;
};

export const createCourseService = async (userId:number , data:createCourseDataType) => {
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

    const result = await prisma.$transaction(async (tx) => {

      const course = await tx.course.create({
        data: {
            status: data.status,
            startDate: data.startDate ?? null,
            endDate: data.endDate ?? null, 
            courseTime: data.courseTime,
            price: data.price , 
            categoryId: data.categoryId , 
            teacherId: teacher.id,

            translations: {
                create: data.translations.map((translation) => ({
                    language: translation.language,
                    title: translation.title,
                    shortDescription: translation.shortDescription,
                    description: translation.description
                }))
            }
        }
      })

      for (const sectionData of data.sections){
         const section = await tx.section.create({
            data: {
                order: sectionData.order,
                courseId: course.id,
                translations: {
                    create: sectionData.translations.map((translation) => ({
                        language: translation.language,
                        title: translation.title
                    }))
                }
            }
        });

        for (const lessonData of sectionData.lessons) {

            await tx.lesson.create({
                data: {
                    duration: lessonData.duration,
                    order: lessonData.order,
                    sectionId: section.id,

                    translations: {
                        create: lessonData.translations.map((translation) => ({
                            language: translation.language,
                            title: translation.title
                        }))
                    }
                }
            });

        }
      }

      return course
    })


    return result
}


export const getAllCourses = async (
    page: number,
    limit: number,
    search?: string,
    categoryId?: number,
    teacherId?: number,
    minPrice?: number,
    maxPrice?: number,
    priceType?: "FREE" | "PAID",
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
    lang: Language = Language.FA
) => {

    const skip = (page - 1) * limit;

    const where = {
        ...(search && {
            translations: {
                some: {
                    language: lang,
                    title: {
                        contains: search,
                        mode: "insensitive" as const
                    }
                }
            }
        }),

        ...(categoryId !== undefined && {
            categoryId
        }),

        ...(teacherId !== undefined && {
            teacherId
        }),

        ...(
            minPrice !== undefined ||
            maxPrice !== undefined ||
            priceType !== undefined
                ? {
                    price: {
                        ...(minPrice !== undefined && {
                            gte: minPrice
                        }),

                        ...(maxPrice !== undefined && {
                            lte: maxPrice
                        }),

                        ...(priceType === "FREE" && {
                            equals: 0
                        }),

                        ...(priceType === "PAID" && {
                            gt: 0
                        })
                    }
                }
                : {}
        )
    };

    let orderBy;

    switch (sortBy) {

        case "popular":
            orderBy = {
                studentCount: sortOrder
            };
            break;

        case "newest":
            orderBy = {
                createdAt: sortOrder
            };
            break;

        case "cheapest":
            orderBy = {
                price: "asc" as const
            };
            break;

        case "expensive":
            orderBy = {
                price: "desc" as const
            };
            break;

        default:
            orderBy = {
                studentCount: "desc" as const
            };
    }

    const priceStats = await prisma.course.aggregate({
    _min: {
        price: true
    },
    _max: {
        price: true
    }
    });

    const [courses, total] = await Promise.all([

        prisma.course.findMany({
            where,
            skip,
            take: limit,
            orderBy,

            include: {

                translations: {
                    where: {
                        language: lang
                    }
                },

                teacher: {
                    select: {
                        id: true,
                        avatar: true,

                        translations: {
                            where: {
                                language: lang
                            }
                        }
                    }
                },

                category: {
                    select: {
                        id: true,

                        translations: {
                            where: {
                                language: lang
                            }
                        }
                    }
                },

                _count: {
                    select: {
                        favorites: true,
                    }
                },
                sections: {
                    select: {
                        _count: {
                            select: {
                                lessons: true
                            }
                        }
                    }
                }
            }
        }),

        prisma.course.count({
            where
        })
    ]);

    console.log(
    "Course 10041 from database:",
    courses.find((course) => course.id === 10041)
    );

    const formattedCourses = courses.map((course) => {

        const translation = course.translations[0];
        const teacherTranslation = course.teacher.translations[0];
        const categoryTranslation = course.category.translations[0];

        return {
            id: course.id,
            studentCount: course.studentCount,
            status: course.status,
            startDate: course.startDate,
            endDate: course.endDate,
            uploadDate: course.uploadDate,
            courseTime: course.courseTime,
            price: course.price,
            thumbnail: course.thumbnail,
            favoriteCount: course._count.favorites,

            title: translation?.title ?? "",
            shortDescription: translation?.shortDescription ?? "",
            description: translation?.description ?? "",

            lessonCount: course.sections.reduce(
                (total,section) => total + section._count.lessons,
                0
            ),

            teacher: {
                id: course.teacher.id,
                avatar: course.teacher.avatar,
                name: teacherTranslation?.name ?? "",
                bio: teacherTranslation?.bio ?? ""
            },

            category: {
                id: course.category.id,
                name: categoryTranslation?.name ?? ""
            },

            createdAt: course.createdAt,
            updatedAt: course.updatedAt
        };
    });

    const totalPages = Math.ceil(total / limit);

    return {
        courses: formattedCourses,

        pagination: {
            page,
            limit,
            total,
            totalPages
        },

        priceRange: {
        min: priceStats._min.price ?? 0,
        max: priceStats._max.price ?? 0
        }
    };
};


export const getCourseByIdService = async (courseId: number , lang: Language = Language.FA) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            teacher: {
                select: {
                    id: true,
                    avatar:true,
                    
                    translations: {
                        where: {
                            language: lang
                        }
                    }
                }
            },
            category: {
                select: {
                    id:true,
                    translations: {
                        where: {
                            language: lang
                        }
                    }
                }
            },
            translations: {
                where: {
                    language: lang
                }
            },
            comments: {
                where: {
                    parentId: null
                },
                include: {
                    user: {
                        select: {
                            id:true,
                            name:true,
                            avatar:true
                        }
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id:true,
                                    name:true,
                                    avatar: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            reviews: {
                include: {
                    user:{
                        select: {
                            id:true,
                            name:true,
                            avatar:true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            sections: {
               orderBy: {
                 order: "asc"
               },
               include: {
                translations: {
                    where: {
                        language: lang
                    }
                },
                lessons: {
                    orderBy: {
                        order: "asc"
                    },
                    include: {
                        translations: {
                            where: {
                                language: lang
                            }
                        }
                    }
                }
               }
            }

        }
    })

    if(!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    const courseTranslation = course.translations?.[0]
    const teacherTranslation = course.teacher.translations?.[0]
    const categoryTranslation = course.category.translations?.[0]

    return {
        id: course.id,
        thumbnail: course.thumbnail,
        studentCount: course.studentCount,
        status: course.status,
        startDate: course.startDate,
        endDate: course.endDate,
        uploadDate: course.uploadDate,
        courseTime: course.courseTime,
        price: course.price,
        title: courseTranslation?.title ?? "",
        shortDescription: courseTranslation?.shortDescription ?? "",
        description:  courseTranslation?.description ?? "",
        teacher: {
         id: course.teacher.id,
         avatar: course.teacher.avatar,
         name: teacherTranslation?.name ?? "",
         bio: teacherTranslation?.bio ?? ""
         },
         category: {
        id: course.category.id,

        name: categoryTranslation?.name ?? ""
    },

    sections: course.sections.map((section) => {

        const sectionTranslation =
            section.translations?.[0]

        return {
            id: section.id,

            order: section.order,

            title: sectionTranslation?.title ?? "",

            lessons: section.lessons.map((lesson) => {

                const lessonTranslation =
                    lesson.translations?.[0]

                return {
                    id: lesson.id,

                    duration: lesson.duration,

                    order: lesson.order,

                    title:
                        lessonTranslation?.title ?? ""
                }
            })
        }
    }),
    comments: course.comments,
    reviews: course.reviews,
    createdAt: course.createdAt,
    }
}


export const updateCourseService = async (courseId: number , userId:number , data:UpdateCourseInput) => {

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

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if(!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    if(course.teacherId !== teacher.id){
        throw new AppError(
            "You do not have permission tov update this course",
            403
        )
    }

    const { translations, ...courseData } = data

    const updatedCourse = await prisma.$transaction(async (tx) => {
        const course = await tx.course.update({
            where: {
                id: courseId
            },
            data: courseData
        })

        if(translations){
        for(const translation of translations){
            await tx.courseTranslation.upsert({
                where: {
                    courseId_language: {
                        courseId,
                        language: translation.language
                    }
                },
                update: {
                    title: translation.title,
                    shortDescription: translation.shortDescription,
                    description: translation.description
                },
                create: {
                    courseId,
                    language: translation.language,
                    title: translation.title,
                    shortDescription: translation.shortDescription,
                    description: translation.description
                }
            })
          }
       } 

       return course
    })


    return updatedCourse
}


export const deleteCourseService = async (courseId: number , userId: number) => {
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

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if(!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    if(course.teacherId !== teacher.id){
        throw new AppError(
            "you do not have permission to delete this course",
            403
        )
    }

    await prisma.course.delete({
        where: {
            id: courseId
        }
    })

}


export const getSectionLessonsService = async (
    sectionId: number,
    lang: Language = Language.FA
) => {

    const lessons = await prisma.lesson.findMany({

        where: {
            sectionId
        },

        orderBy: {
            order: "asc"
        },

        include: {

            translations: {
                where: {
                    language: lang
                }
            }
        }
    })


    return lessons.map((lesson) => {

        const translation =
            lesson.translations[0]

        return {

            id: lesson.id,

            duration: lesson.duration,

            order: lesson.order,

            title:
                translation?.title ?? "",

            createdAt:
                lesson.createdAt
        }
    })
}



export const getPurchasedCourses = async (
    userId: number,
    lang: Language = Language.FA
) => {

    const purchasedCourses =
        await prisma.purchasedCourse.findMany({

            where: {
                userId
            },

            include: {

                course: {

                    include: {

                        translations: {
                            where: {
                                language: lang
                            }
                        },

                        teacher: {
                            select: {
                                id: true,
                                avatar: true,

                                translations: {
                                    where: {
                                        language: lang
                                    }
                                }
                            }
                        },

                        category: {
                            select: {
                                id: true,

                                translations: {
                                    where: {
                                        language: lang
                                    }
                                }
                            }
                        }

                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            }
        })


    return purchasedCourses.map((item) => {

        const courseTranslation =
            item.course.translations[0]

        const teacherTranslation =
            item.course.teacher.translations[0]

        const categoryTranslation =
            item.course.category.translations[0]

        return {

            id: item.id,

            createdAt: item.createdAt,

            course: {

                id: item.course.id,

                studentCount:
                    item.course.studentCount,

                status:
                    item.course.status,

                startDate:
                    item.course.startDate,

                endDate:
                    item.course.endDate,

                uploadDate:
                    item.course.uploadDate,

                courseTime:
                    item.course.courseTime,

                price:
                    item.course.price,

                title:
                    courseTranslation?.title ?? "",

                shortDescription:
                    courseTranslation?.shortDescription ?? "",

                description:
                    courseTranslation?.description ?? "",

                teacher: {

                    id:
                        item.course.teacher.id,

                    avatar:
                        item.course.teacher.avatar,

                    name:
                        teacherTranslation?.name ?? "",

                    bio:
                        teacherTranslation?.bio ?? ""
                },

                category: {

                    id:
                        item.course.category.id,

                    name:
                        categoryTranslation?.name ?? ""
                }
            }
        }
    })
}


export const addFavorite = async (userId: number , courseId: number) => {

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if(!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    const existingFavorite = await prisma.favorite.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    if(existingFavorite){
        throw new AppError(
            "Course is already in favorites",
            400
        )
    }

    const favorite = await prisma.favorite.create({
        data: {
            userId,
            courseId,
            createdAt: new Date()
        }
    })

    return favorite
}


export const removeFavorite = async (userId : number , courseId: number) => {
    const favorite = await prisma.favorite.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    if(!favorite){
        throw new AppError(
            "Course is not in favorites",
            404
        )
    }

    await prisma.favorite.delete({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })
}


export const getFavorites = async (
    userId: number,
    lang: Language = Language.FA
) => {

    const favorites =
        await prisma.favorite.findMany({

            where: {
                userId,

                courseId: {
                    not: null
                }
            },

            include: {

                course: {

                    include: {

                        translations: {
                            where: {
                                language: lang
                            }
                        },

                        teacher: {
                            select: {
                                id: true,
                                avatar: true,

                                translations: {
                                    where: {
                                        language: lang
                                    }
                                }
                            }
                        },

                        category: {
                            select: {
                                id: true,

                                translations: {
                                    where: {
                                        language: lang
                                    }
                                }
                            }
                        }
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            }
        })


    return favorites.map((favorite) => {

        if (!favorite.course) {
            return favorite
        }

        const courseTranslation =
            favorite.course.translations[0]

        const teacherTranslation =
            favorite.course.teacher.translations[0]

        const categoryTranslation =
            favorite.course.category.translations[0]

        return {

            id: favorite.id,

            createdAt: favorite.createdAt,

            course: {

                id:
                    favorite.course.id,

                studentCount:
                    favorite.course.studentCount,

                status:
                    favorite.course.status,

                startDate:
                    favorite.course.startDate,

                endDate:
                    favorite.course.endDate,

                uploadDate:
                    favorite.course.uploadDate,

                courseTime:
                    favorite.course.courseTime,

                price:
                    favorite.course.price,

                title:
                    courseTranslation?.title ?? "",

                shortDescription:
                    courseTranslation?.shortDescription ?? "",

                description:
                    courseTranslation?.description ?? "",

                teacher: {

                    id:
                        favorite.course.teacher.id,

                    avatar:
                        favorite.course.teacher.avatar,

                    name:
                        teacherTranslation?.name ?? "",

                    bio:
                        teacherTranslation?.bio ?? ""
                },

                category: {

                    id:
                        favorite.course.category.id,

                    name:
                        categoryTranslation?.name ?? ""
                }
            }
        }
    })
}


export const createReview = async (userId: number , courseId: number , rating: number) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if(!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    const existingReview = await prisma.review.findUnique({
    where: {
        userId_courseId: {
            userId,
            courseId
        }
    }
    });

    if (existingReview) {
        throw new AppError(
            "You have already reviewed this course",
            409
        );
    }

    const purchase = await prisma.purchasedCourse.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    if(!purchase){
        throw new AppError(
            "You can only review courses you have purchased",
            403
        )
    }

    const review = await prisma.review.create({
        data: {
            userId,
            courseId,
            rating,
            createdAt: new Date()
        }
    })

    return review
}

export const getCourseReviews = async (courseId: number) => {

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if(!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    const reviews = await prisma.review.findMany({
        where: {
            courseId
        },
        include: {
            user:{
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return reviews
}   


export const updateReview = async (userId: number , courseId: number , rating: number) => {

    const review = await prisma.review.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    if(!review){
        throw new AppError(
            "Review not found",
            404
        )
    }

    const updatedReview = await prisma.review.update({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        },
        data: {
            rating,
            updatedAt: new Date()
        }
    })

    return updatedReview
}  



export const deleteReview = async (userId: number , courseId: number) => {
    const review = await prisma.review.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    if(!review){
        throw new AppError(
            "Review not found",
            404
        )
    }

    await prisma.review.delete({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })
}

export const createComment = async (userId: number , courseId: number , content: string) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if(!course){
        throw new AppError(
            "Course not found",
            404
        )
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            userId,
            courseId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true , 
                    avatar: true
                }
            }
        }
    })

    return comment
}

export const getCourseComments = async (courseId: number) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    })

    if(!course){
        throw new AppError(
            "Course not found", 
            404
        )
    }

    const comments = await prisma.comment.findMany({
        where: {
            courseId,
            parentId: null
        },
        include: {
            user: {
                select: {
                    id: true,
                    name:true , 
                    avatar: true
                }
            },
            replies: {
                include: {
                    user: {
                        select: {
                            id: true, 
                            name: true,
                            avatar: true
                        }
                    }
                },
                orderBy: {
                createdAt: "asc"
              }
            },

            _count: {
                select: {
                    likes: true
                }
            }
            
        },
        orderBy: {
            createdAt: "desc"
        }
        
    })

    return comments
}


export const createReply = async (
  userId: number,
  commentId: number,
  content: string
) => {
  const parentComment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!parentComment) {
    throw new AppError(
        "Comment not found",
         404);
  }

   if (!parentComment.courseId) {
     throw new AppError(
        "This comment does not belong to a course",
        400
     );
   }

  const reply = await prisma.comment.create({
    data: {
      content,
      userId,
      courseId: parentComment.courseId,
      parentId: parentComment.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return reply;
};


export const likeComment = async (
  userId: number,
  commentId: number
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new AppError(
        "Comment not found" ,
         404);
  }

  if (!comment.courseId) {
    throw new AppError(
        "This comment does not belong to a course",
        400
    );
}

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (existingLike) {
    throw new AppError(
        "Comment already liked",
         409);
  }

  const like = await prisma.commentLike.create({
    data: {
      userId,
      commentId,
    },
  });

  return like;
};

export const unlikeComment = async (userId: number , commentId: number) => {
    const like = await prisma.commentLike.findUnique({
        where: {
            userId_commentId: {
                userId , 
                commentId
            }
        }
    })

    if(!like){
        throw new AppError(
            "Comment is not liked",
            400
        )
    }

    await prisma.commentLike.delete({
        where: {
            id: like.id
        }
    })
}


export const uploadThumbnail = async (courseId: number , userId: number, file: Express.Multer.File) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            teacher:true
        }
    })

    if(!course){
        throw new AppError(
            "course not found",
            404
        )
    }

    if(course.teacher.userId !== userId){
        throw new AppError(
            "you are not allowed to modify this course",
            403
        )
    }

    if(course.thumbnail){
        const oldThumbnailPath = path.join(
            process.cwd(),
            "src",
            course.thumbnail.replace(/^\/+/, "")
        )

        try{
            await fs.unlink(oldThumbnailPath)
        }catch{

        }
    }

    const thumbnailPath = `/uploads/courses/${file.filename}`

    const updatedcourse = await prisma.course.update({
        where: {
            id: courseId
        },
        data: {
            thumbnail: thumbnailPath
        }
    })

    return updatedcourse

}