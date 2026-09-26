import { NextFunction , Response , Request} from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { AppError } from "../../common/errors/AppErrors";
import { becomeTeacherService, getMyTeacherProfileService, getTeachersService, updateTeacher , uploadAvatar as uploadAvatarService , deleteAvatar as deleteAvatarService } from "./teacher.service";
import { Language } from "../../generated/prisma/enums";

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

        const lang = typeof req.query.lang === "string" ? req.query.lang : Language.FA

        if (lang !== Language.FA && lang !== Language.EN) {
            throw new AppError(
                "Invalid language. use FA or EN",
                400
            )
        }

        const teacher = await getMyTeacherProfileService(
            req.user.id , lang
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

    if (!userId) {
            throw new AppError(
                "Authentication required",
                401
            )
        }

    const teacher = await updateTeacher(userId, req.body)

    return res.status(200).json({
        message: "Teacher profile updated successfully",
        teacher
    })

 }catch(error){
    next(error)
 }
}


export const getTeachersController = async (req:Request , res:Response , next:NextFunction) => {
    try{
        const search = typeof req.query.search === "string" ?
        req.query.search : undefined

        const lang =
            typeof req.query.lang === "string"
                ? req.query.lang
                : Language.FA

        if (lang !== Language.FA && lang !== Language.EN) {
            throw new AppError(
                "Invalid language. use FA or EN",
                400
            )
        }


        const teachers = await getTeachersService(search , lang)

        return res.status(200).json({
            teachers
        })

    }catch(error){
        next(error)
    }
}


export const uploadAvatar = async ( req: Request,res: Response, next:NextFunction) => {
  try {

    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "Avatar file is required",
      });
    }

    const teacher = await uploadAvatarService(
      Number(req.params.teacherId),
      req.file
    );

    return res.status(200).json({
      message: "Teacher avatar uploaded successfully",
      teacher,
    });
  } catch (error) {
    next(error)
  }
};


export const deleteAvatar = async (req: Request, res: Response , next:NextFunction) => {
  try {
    const teacher = await deleteAvatarService(
      Number(req.params.teacherId)
    );

    return res.status(200).json({
      message: "Teacher avatar deleted successfully",
      teacher,
    });
  } catch (error) {
    next(error)
  }
};