import { AppError } from "../../common/errors/AppErrors"
import { prisma } from "../../config/prisma"
import { createCourseDataType } from "./courses.schema"


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
            title: data.title,
            shortDescription: data.shortDescription,
            description: data.description,
            status: data.status,
            startDate: data.startDate ?? null,
            endDate: data.endDate ?? null, 
            courseTime: data.courseTime,
            price: data.price , 
            categoryId: data.categoryId , 
            teacherId: teacher.id
        }
      })

      for (const sectionData of data.sections){
         const section = await tx.section.create({
            data: {
                title: sectionData.title,
                order: sectionData.order,
                courseId: course.id
            }
        });

        for (const lessonData of sectionData.lessons) {

            await tx.lesson.create({
                data: {
                    title: lessonData.title,
                    duration: lessonData.duration,
                    order: lessonData.order,
                    sectionId: section.id
                }
            });

        }
      }

      return course
    })


    return result
}




export const getAllCourses = async (page:number , limit:number , search?:string, categoryId?: number, sortBy:string = "createdAt" , sortOrder: "asc" | "desc" = "desc") => {

    const skip = (page - 1) * limit

    const where = {
        ...(search  && {
            title: {
                contains: search,
                mode: "insensitive" as const
            }
        }),

        ...(categoryId && {
            categoryId
        })
    }

    const [courses, total] = await Promise.all([
        prisma.course.findMany({
            where,
            skip,
            take: limit,

            orderBy: {
                [sortBy]: sortOrder
            },

            include:{
                teacher: true , 
                category: true
            }
        }),

        prisma.course.count({
            where
        })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
        courses,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    }
}




export const getCourseByIdService = async (courseId: number) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        },
        include: {
            teacher: true,
            category:true, 
            comments: true,
            reviews: true,
            sections: {
                include: {
                    lessons: true
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

    return course
}


export const updateCourseService = async (courseId: number , userId:number , data:any) => {

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

    const updatedCourse = await prisma.course.update({
        where: {
            id: courseId
        },
        data: {
            ...data
        }
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


export const getSectionLessonsService = async (sectionId: number) => {
    const lessons = await prisma.lesson.findMany({
        where: {
            sectionId
        },
        orderBy: {
            order: "asc"
        }
    })

    return lessons
}



export const getPurchasedCourses = async (userId: number) => {
    const purchasedCourses = await prisma.purchasedCourse.findMany({
        where: {
            userId
        },
        include: {
            course: {
                include: {
                    teacher: true,
                    category: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return purchasedCourses
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


export const getFavorites = async (userId: number) => {
    const favorites = await prisma.favorite.findMany({
        where: {
            userId,
            courseId: {
                not: null
            }
        },
        include: {
            course: {
                include: {
                    teacher: true,
                    category: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return favorites
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
                    email: true
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
                }
            },
            orderBy: {
                createdAt: "asc"
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
    throw new Error("Comment not found");
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
    throw new Error("Comment not found");
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
    throw new Error("Comment already liked");
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