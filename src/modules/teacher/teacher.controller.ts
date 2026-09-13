import { NextFunction , Response } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { AppError } from "../../common/errors/AppErrors";
import { becomeTeacherService, getMyTeacherProfileService, updateTeacher } from "./teacher.service";

export const becomeTeacher = async (req:AuthRequest , res: Response , next: NextFunction) => {
    try{
        if (!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const teacher = await becomeTeacherService(
            req.user.id ,
            req.body
        )

        return res.status(201).json({
            message: "You are now a teacher",
            teacher
        })
    }catch(error){
        next(error)
    }
}

export default becomeTeacher



export const getMyTeacherProfile = async ( req:AuthRequest , res:Response , next:NextFunction) => {
    try{

        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const teacher = await getMyTeacherProfileService(
            req.user.id
        )

        return res.status(200).json({
            teacher
        })

    }catch(error){
        next(error)
    }
}


export const updateTeacherController = async (req:AuthRequest , res:Response , next:NextFunction) => {
 try{

    const userId = req.user?.id
    const teacher = await updateTeacher(userId as number , req.body)

    return res.status(200).json({
        message: "Teacher profile updated successfully",
        teacher
    })

 }catch(error){
    next(error)
 }
}