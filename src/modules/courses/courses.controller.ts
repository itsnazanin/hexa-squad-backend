import { Request , Response , NextFunction } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { AppError } from "../../common/errors/AppErrors";
import { addFavorite, createComment, createCourseService, createReply, createReview, deleteCourseService, deleteReview, getAllCourses, getCourseByIdService, getCourseComments, getCourseReviews, getFavorites, getPurchasedCourses, likeComment, removeFavorite, unlikeComment, updateCourseService, updateReview } from "./courses.service";


export const createCourse = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }
        const course = await createCourseService(
            req.user.id ,
            req.body
         )
        return res.status(201).json({
            message: "Course Created successfully",
            course
        })

    }catch(error){
        next(error)
    }
}


export const getCourses = async (req:Request , res:Response , next:NextFunction) => {
    try{
        const search = typeof req.query.search === "string" ? req.query.search  : undefined
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined
        const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt" 
        const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc"

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 12

        const result = await getAllCourses(page , limit, search, categoryId , sortBy , sortOrder)

        return res.status(200).json({
            result
        })

    }catch(error){
        next(error)
    }
}



export const getCourseById = async (req:Request , res:Response , next:NextFunction) => {
    try{
        const courseId = Number(req.params.id)
        const course = await getCourseByIdService(courseId)
        return res.status(200).json({
            course
        })

    }catch(error){
        next(error)
    }
}


export const updateCourse = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const courseId = Number(req.params.id)

        const course = await updateCourseService(courseId , req.user.id , req.body)

        return res.status(200).json({
            message: "Course updated successfully",
            course
        })
    }catch(error){
        next(error)
    }
}


export const deleteCourse = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const courseId = Number(req.params.id)

        await deleteCourseService(courseId , req.user.id)

        return res.status(200).json({
            message: "Course deleted successfully",
        })

    }catch(error){
        next(error)
    }
}



export const getPurchasedCoursesController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id

        const courses = await getPurchasedCourses(userId)

        return res.status(200).json({
            courses
        })
        
    }catch(error){
        next(error)
    }
}


export const addFavoriteController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course Id"
            })
        }

        const favorite  = await addFavorite(userId as number , courseId)

        return res.status(201).json({
            message: "Course added to favorites",
            favorite
        })

    }catch(error){
        next(error)
    }
}


export const removeFavoriteController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course Id"
            })
        }

       await removeFavorite(userId , courseId)

        return res.status(200).json({
            message: "Course removed from favorites"
        })

    }catch(error){
        next(error)
    }
}


export const getFavoritesController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id

        const favorites = await getFavorites(userId)

        return res.status(200).json({
            favorites
        })

    }       
    catch(error){
        next(error)
    }

}


export const createReviewController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course Id"
            })
        }

        const { rating } = req.body
        const review = await createReview(
            userId , 
            courseId , 
            rating
        )

        return res.status(201).json({
            message: "Review created successfully",
            review
        })
        
    }catch(error){
        next(error)
    }
}


export const getCourseReviewsController = async (req:Request , res: Response , next:NextFunction) => {
    try{
        const courseId = Number(req.params.courseId)
        
        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course Id"
            })
        }

        const reviews = await getCourseReviews(courseId)

        return res.status(200).json({
            reviews
        })

    }catch(error){
        next(error)
    }
}

export const updateReviewController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course Id"
            })
        }

        const { rating } = req.body

        const review = await updateReview(
            userId , 
            courseId , 
            rating
        )

        return res.status(200).json({
            message: "Review updated successfully",
            review
        })

    }catch(error){
        next(error)
    }
}

export const deleteReviewController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course Id"
            })
        }

        await deleteReview(userId , courseId)

        return res.status(200).json({
            message: "Review deleted successfully"
        })  
    }catch(error){
        next(error)
    }
}


export const createCommentController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        const userId = req.user?.id
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course Id"
            })
        }

        const { content } = req.body

        const comment = await createComment(
            userId as number , 
            courseId , 
            content
        )

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        })


    }catch(error){
        next(error)
    }
}

export const getCourseCommentsController = async (req:Request , res:Response , next:NextFunction) => {
    try{
        const courseId = Number(req.params.courseId)

        if(Number.isNaN(courseId)){
            return res.status(400).json({
                message: "Invalid course ID"
            })
        }

        const comments = await getCourseComments(courseId)

        return res.status(200).json({
            comments
        })

    }catch(error){
        next(error)
    }
}


export const createReplyController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{

        const userId = req.user?.id
        const commentId = Number(req.params.commentId)

        if(Number.isNaN(commentId)){
            return res.status(400).json({
                message: "Invalid comment ID"
            })
        }

        const { content } = req.body

        const reply = await createReply(
            userId as number,
            commentId,
            content
        )

        return res.status(201).json({
            message: "Reply created Successfully",
            reply
        })

    }catch(error){
        next(error)
    }
}


export const likeCommentController = async (req:AuthRequest , res:Response , next:NextFunction) => {
 try{

    const userId = req.user?.id
    const commentId = Number(req.params.commentId)

    if(Number.isNaN(commentId)){
            return res.status(400).json({
                message: "Invalid comment ID"
            })
    }

    const like =await likeComment(
        userId as number,
        commentId
    )

    return res.status(201).json({
        message: "Comment liked successfully",
        like
    })

 }catch(error){
    next(error)
 }
}


export const unlikeCommentController = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.user){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        const userId = req.user.id
        const commentId = Number(req.params.commentId)

       if(Number.isNaN(commentId)){
         return res.status(400).json({
         message: "Invalid comment ID"
         })
        }

        await unlikeComment(
            userId as number,
            commentId
        )

        return res.status(200).json({
            message: "Comment unliked successfully"
        })

    }catch(error){
        next(error)
    }
}