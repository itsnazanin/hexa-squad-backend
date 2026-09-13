import { Response , NextFunction } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { prisma } from "../../config/prisma";



export const courseAccessMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.id
        const  courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid courseId"
            })
        }

        const purchase = await prisma.purchasedCourse.findUnique({
            where: {
                userId_courseId: {
                    userId: userId as number,
                    courseId
                }
            }
        })

        if(!purchase){
            return res.status(403).json({
                message: "Access denied. You have not purchased this course."
            })
        }

        next()

    }catch(error){
        next(error)
    }
}