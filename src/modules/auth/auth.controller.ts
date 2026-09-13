import { AppError } from "../../common/errors/AppErrors"
import { AuthRequest } from "../../types/AuthRequest"
import { getProfileUser, loginUser, registerUser } from "./auth.service"
import { Request , Response , NextFunction } from "express"

export const register = async (req: Request , res: Response , next: NextFunction) => {
    try {
        const user  = await registerUser(req.body)
        return res.status(201).json({
            message : "User registered successfully",
            user
        })
    }
    catch (error) {
        next(error)
    }
}

export const login = async (req:Request , res:Response , next: NextFunction) => {
    try{
        const result = await loginUser(req.body)

        return res.status(200).json({
                message: "Login successful" ,
                accessToken: result.accessToken
        })
    }catch(error){
        next(error)
    }
    
}

export const getProfile = async (req: AuthRequest , res: Response , next: NextFunction) => {
    try{

         if (!req.user) {
            throw new AppError(
                "Authentication required",
                401
            );
        }

        const userProfileData = await getProfileUser(req.user.id)
        return res.status(200).json({
            userProfileData
        })

    }catch(error){
        next(error)
    }
}