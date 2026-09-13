import { AppError } from "../../common/errors/AppErrors"
import { prisma } from "../../config/prisma"

export const createLessonService = async (sectionId: number , userId: number , data: {
    title: string,
    duration: number,
    order: number
}) => {
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
            title: data.title,
            duration: data.duration,
            order: data.order,
            sectionId
        }
    })

    return lesson
}


export const updateLessonService = async (lessonId:number , userId:number , data: {
    title?: string
    duration: number
    order?: number
}) => {
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
        data
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


export const getLessonById = async (lessonId: number , courseId: number) => {
    
    const lesson = await prisma.lesson.findFirst({
        where: {
            id: lessonId,
            section: {
                courseId
            }
        }
    })

    if(!lesson){
        throw new AppError(
            "Lesson not found",
            404
        )
    }

    return lesson
}