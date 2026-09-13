import { Request , Response , NextFunction } from "express"
import { AuthRequest } from "../../types/AuthRequest"
import { AppError } from "../../common/errors/AppErrors"
import { createLessonService, deleteLessonService, getLessonById, updateLessonService } from "./lessons.service"
import { getSectionLessonsService } from "./courses.service"

export const createLessons = async (req:AuthRequest , res: Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }
        const sectionId = Number(req.params.sectionId)
        const lesson = await createLessonService(
            sectionId,
            req.user.id,
            req.body
        )

        return res.status(201).json({
            message: "Lessons created successfully",

        })

    }catch(error){
        next(error)
    }
}

export const getSectionLessons = async (req:Request , res:Response, next:NextFunction) => {
    try{
        const sectionId = Number(req.params.sectionId)
        const lessons = await getSectionLessonsService(sectionId)
        return res.status(200).json({
            lessons
        })
    }catch(error){
        next(error)
    }
}

export const updateLesson = async (req:AuthRequest , res:Response, next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }
        const lessonId = Number(req.params.id)
        const lesson = await updateLessonService(
            lessonId, 
            req.user.id,
            req.body
        )

        return res.status(200).json({
            message: "Lesson updated successfully",
            lesson
        });

    }catch(error){
        next(error)
    }
}


export const deleteLesson = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const lessonId = Number(req.params.id)

        await deleteLessonService(lessonId , req.user.id)

        return res.status(200).json({
            message: "Lesson deleted successfully"
        })

    }catch(error){
        next(error)
    }
}


export const getLessonController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }
        const lessonId = Number(req.params.lessonId)
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(lessonId)){
            return res.status(400).json({
                message: "Invalid lesson Id"
            })
        }

        const lesson = await getLessonById(lessonId , courseId)

        return res.status(200).json({
            lesson
        })

    }catch(error){
        next(error)
    }
}