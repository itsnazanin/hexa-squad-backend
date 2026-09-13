import { AppError } from "../errors/AppErrors";
import jwt from "jsonwebtoken"
import { Request , Response , NextFunction } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { prisma } from "../../config/prisma";


export const authMiddleware = async (req:AuthRequest, res:Response , next:NextFunction) => {
    try{
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const token = authHeader?.split(" ")[1]

        if(!token){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { userId: number }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        })

        if(!user){
            throw new AppError(
                "User not found",
                404
            )
        }

        req.user = {
            id: user.id,
            role: user.role
        }

        next()
    }
    catch(error){

        if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
             ) {
            return next(
                new AppError(
                    "Invalid or expired token",
                    401
                )
            );
         }


        next(error)
    }
}