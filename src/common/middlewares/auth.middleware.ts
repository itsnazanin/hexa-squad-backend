import { AppError } from "../errors/AppErrors";
import jwt from "jsonwebtoken"
import { Response , NextFunction } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";


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
            env.JWT_SECRET!
        )

        if (typeof decoded !== "object" || decoded === null || !("userId" in decoded) || typeof decoded.userId !== "number"){
            throw new AppError(
                "invalid token payload",
                401
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                role:true
            }
        })

        if(!user){
            throw new AppError(
                "Unauthorized",
                401
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