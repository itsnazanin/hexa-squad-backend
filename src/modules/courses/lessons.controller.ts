import { Request , Response , NextFunction } from "express"
import { AuthRequest } from "../../types/AuthRequest"
import { AppError } from "../../common/errors/AppErrors"
import { createLessonService, deleteLessonFile, deleteLessonService, getLessonById, getLessonFiles, updateLessonService , uploadLessonFile as uploadLessonFileService, getLessonFileForDownload } from "./lessons.service"
import { getSectionLessonsService } from "./courses.service"
import { Language } from "../../generated/prisma/enums"
import path from "path"

export const createLessons = async (req:AuthRequest , res: Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }
        const sectionId = Number(req.params.sectionId)
        const lesson = await createLessonService(
            sectionId,
            req.user.id,
            req.body
        )

        return res.status(201).json({
            message: "Lessons created successfully",

        })

    }catch(error){
        next(error)
    }
}

export const getSectionLessons = async (req:Request , res:Response, next:NextFunction) => {
    try{
        const sectionId = Number(req.params.sectionId)

        if (!Number.isInteger(sectionId) || sectionId <= 0) {
            throw new AppError("Invalid section ID", 400);
        }

        const langParam = req.query.lang

        const lang = langParam === "EN" ? Language.EN : Language.FA
        
        const lessons = await getSectionLessonsService(sectionId,lang)
        return res.status(200).json({
            lessons
        })
    }catch(error){
        next(error)
    }
}

export const updateLesson = async (req:AuthRequest , res:Response, next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }
        const lessonId = Number(req.params.id)
        const lesson = await updateLessonService(
            lessonId, 
            req.user.id,
            req.body
        )

        return res.status(200).json({
            message: "Lesson updated successfully",
            lesson
        });

    }catch(error){
        next(error)
    }
}


export const deleteLesson = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const lessonId = Number(req.params.id)

        await deleteLessonService(lessonId , req.user.id)

        return res.status(200).json({
            message: "Lesson deleted successfully"
        })

    }catch(error){
        next(error)
    }
}


export const getLessonController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }
        const lessonId = Number(req.params.lessonId)
        const courseId = Number(req.params.courseId)

        if (!Number.isInteger(lessonId) || lessonId <= 0) {
            throw new AppError("Invalid lesson ID", 400);
        }

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

        const lang = req.query.lang === "EN" ? Language.EN : Language.FA

        const lesson = await getLessonById(lessonId , courseId, lang)

        return res.status(200).json({
            lesson
        })

    }catch(error){
        next(error)
    }
}



export const uploadFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    if (!req.file) {
      throw new AppError(
        "Lesson file is required",
        400
      );
    }

    const lessonId = Number(req.params.id);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      throw new AppError(
        "Invalid lesson ID",
        400
      );
    }

    const lessonFile = await uploadLessonFileService(
      lessonId,
      req.user.id,
      req.file
    );

    return res.status(201).json({
      message: "Lesson file uploaded successfully",
      file: lessonFile,
    });
  } catch (error) {
    next(error);
  }
};


export const getLessonFilesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = Number(req.params.lessonId);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      throw new AppError(
        "Invalid lesson ID",
        400
      );
    }

    const files = await getLessonFiles(lessonId);

    return res.status(200).json({
      files
    });
  } catch (error) {
    next(error);
  }
};


export const deleteLessonFileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const lessonId = Number(req.params.lessonId);
    const fileId = Number(req.params.fileId);

    if (
      !Number.isInteger(lessonId) ||
      lessonId <= 0 ||
      !Number.isInteger(fileId) ||
      fileId <= 0
    ) {
      throw new AppError(
        "Invalid lesson or file ID",
        400
      );
    }

    const file = await deleteLessonFile(
      lessonId,
      fileId,
      req.user.id
    );

    return res.status(200).json({
      message: "Lesson file deleted successfully",
      file,
    });
  } catch (error) {
    next(error);
  }
};


export const downloadLessonFileController = async (req: AuthRequest,res: Response,next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const lessonId = Number(req.params.lessonId);
    const fileId = Number(req.params.fileId);

    if (!Number.isInteger(lessonId) || lessonId <= 0 || !Number.isInteger(fileId) || fileId <= 0) {
      throw new AppError(
        "Invalid lesson or file ID",
        400
      );
    }

    const file = await getLessonFileForDownload(
      lessonId,
      fileId
    );

    const fileName = path.basename(file.fileUrl);

    const filePath = path.join(
      process.cwd(),
      "src/uploads/lessons",
      fileName
    );

    return res.download(
      filePath,
      file.fileName
    );

  } catch (error) {
    next(error);
  }
};