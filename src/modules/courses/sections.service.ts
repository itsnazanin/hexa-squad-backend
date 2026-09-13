import { AppError } from "../../common/errors/AppErrors";
import { prisma } from "../../config/prisma";

type UpdateSectionInput = {
    title: string,
    order: number
}

export const createSectionService = async (
    courseId: number,
    userId: number , 
    data: {
        title: string;
        order: number;
    }) => {

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
                "you do not have permission to modify this course",
                403
            )
        }

        const section = await prisma.section.create({
            data: {
                title: data.title,
                order: data.order,
                courseId
            }
        })

        return section

}


export const getCourseSections = async (courseId: number) => {
    const sections = await prisma.section.findMany({
        where: {
            courseId
        },
        include: {
            lessons: true
        },
        orderBy: {
            order: "asc"
        }
    })

    return sections

}

export const updateSection = async (userId:number , sectionId: number, data: UpdateSectionInput) => {
    const section = await prisma.section.findUnique({
        where: {
            id: sectionId
        },
        include: {
            course: {
                include: {
                    teacher: true
                }
            }
        }
    })

    if (!section){
        throw new AppError(
            "Section not found",
            404
        )
    }

    if(section.course.teacher.userId !== userId){
        throw new AppError(
            "you are not allow to update ths section" , 
            403
        )
    }

    const updatedSection = await prisma.section.update({
        where: {
            id: sectionId
        },
        data
    })

    return updatedSection
}


export const deleteSection = async (userId:number , sectionId:number) => {
    const section = await prisma.section.findUnique({
        where: {
            id:sectionId
        },
        include: {
            course: {
                include: {
                    teacher: true
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

    if(section.course.teacher.userId !== userId){
        throw new AppError(
            "you are not allow to delete this section",
            403
        )
    }await prisma.section.delete({
        where: {
            id: sectionId
        }
    })
}