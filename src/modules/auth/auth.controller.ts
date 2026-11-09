import { AppError } from "../../common/errors/AppErrors"
import { AuthRequest } from "../../types/AuthRequest"
import { getProfileUser, loginUser, registerUser , verifyLoginOtp} from "./auth.service"
import { Request , Response , NextFunction } from "express"

export const register = async (req: Request , res: Response , next: NextFunction) => {
    try {
        const result = await registerUser(req.body)
        return res.status(201).json({
            message : "User registered successfully",
            user: result.user ,
            accessToken: result.accessToken
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
                message: "verifeication code sent" ,
                ...result
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


export const verifyLogin = async (req: Request,res: Response, next: NextFunction) => {
  try {
    const result = await verifyLoginOtp(req.body);

    return res.status(200).json({
      message: "Login successful",
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};


export const resendLoginCode = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      message: "Verification code sent",
      otpRequired: result.otpRequired,
      method: result.method,
      identifier: result.identifier,
    });
  } catch (error) {
    next(error);
  }
};