import { Request , Response , NextFunction } from "express"
import { AppError } from "../../common/errors/AppErrors"
import { AuthRequest } from "../../types/AuthRequest"
import { createSectionService, deleteSection, getCourseSections, updateSection } from "./sections.service"



export const createSection = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const courseId = Number(req.params.courseId)
        
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

    if (Number.isNaN(sectionId)) {
      return res.status(400).json({
        message: "Invalid section ID",
      });
    }

    const section = await updateSection(
      userId as number,
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


    if (Number.isNaN(sectionId)) {
      return res.status(400).json({
        message: "Invalid section ID",
      });
    }

    await deleteSection(userId as number, sectionId)
    
    return res.status(200).json({
        message: "Section deleted successfully"
    })


    }catch(error){
        next(error)
    }
}