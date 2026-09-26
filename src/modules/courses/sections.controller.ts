import { Request , Response , NextFunction } from "express"
import { AppError } from "../../common/errors/AppErrors"
import { AuthRequest } from "../../types/AuthRequest"
import { createSectionService, deleteSection, getCourseSections, updateSection } from "./sections.service"
import { Language } from "../../generated/prisma/enums"


export const createSection = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const courseId = Number(req.params.courseId)

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }
        
        const section = await createSectionService(courseId, req.user.id, req.body)

        return res.status(201).json({
            message: "Section created successfully",
            section
        })

    }catch(error){
        next(error)
    }
}


export const getSections = async (req:Request , res:Response , next:NextFunction) =>{
    try{
        const courseId = Number(req.params.courseId)

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

        const sections = await getCourseSections(courseId)
        return res.status(200).json({
            sections
        })

    }catch(error){
        next(error)
    }
}


export const updateSectionController = async ( req: AuthRequest, res: Response ,  next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const sectionId = Number(req.params.sectionId);

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }   

    if (!Number.isInteger(sectionId) || sectionId <= 0) {
        throw new AppError("Invalid section ID", 400);
    }

    const section = await updateSection(
      userId,
      sectionId,
      req.body
    );

    return res.status(200).json({
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    next(error)
  }
};


export const deleteSectionController = async (req:AuthRequest , res: Response , next:NextFunction) => {
    try{
     const userId = req.user?.id
     const sectionId = Number(req.params.sectionId)

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }  

    if (!Number.isInteger(sectionId) || sectionId <= 0) {
        throw new AppError("Invalid section ID", 400);
    }

    await deleteSection(userId, sectionId)
    
    return res.status(200).json({
        message: "Section deleted successfully"
    })


    }catch(error){
        next(error)
    }
}