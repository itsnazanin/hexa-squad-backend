import { NextFunction, Response } from "express"
import { AuthRequest } from "../../types/AuthRequest"
import { AppError } from "../errors/AppErrors"
import { Role } from "../../generated/prisma/enums"

export const requireRole = (...allowedRoles: Role[]) => {
    return async (req:AuthRequest , res:Response , next: NextFunction) => {
        try{
            if(!req.user){
                throw new AppError(
                    "Authentication required",
                    401
                )
            }

            if(!allowedRoles.includes(req.user.role)){
                throw new AppError(
                    "you do not have permission to perform this action",
                    403
                )
            }
            next()

        }catch(error){
            next(error)
        }
    }
}