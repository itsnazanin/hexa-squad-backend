import { AppError } from "../../common/errors/AppErrors"
import { prisma } from "../../config/prisma"

type UpdatedTeacherInput = {
    name: string,
    bio: string,
    avatar: string
}

export const becomeTeacherService = async (userId: number , 
    data: {
        name: string,
        bio: string,
        avatar: string
    }
) => {

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
            name: data.name,
            bio: data.bio,
            avatar: data.avatar
        }
    });

    return teacher;
});

}


export const getMyTeacherProfileService = async (userId: number) => {

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

    return teacher
}


export const updateTeacher = async (userId: number , data: UpdatedTeacherInput) => {
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
        data
    })

    return updateTeacher
}