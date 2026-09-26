import { Request , Response , NextFunction } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { AppError } from "../../common/errors/AppErrors";
import { addFavorite, createComment, createCourseService, createReply, createReview, deleteCourseService, deleteReview, getAllCourses, getCourseByIdService, getCourseComments, getCourseReviews, getFavorites, getPurchasedCourses, likeComment, removeFavorite, unlikeComment, updateCourseService, updateReview , uploadThumbnail as uploadThumbnailService } from "./courses.service";
import { Language } from "../../generated/prisma/enums";


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
        const allowedSorts = [
            "popular",
            "newest",
            "cheapest",
            "expensive"
        ] as const;

        const lang = typeof req.query.lang === "string" ? req.query.lang : Language.FA

        if(lang !== Language.FA && lang !== Language.EN){
            throw new AppError(
                "Invalid language. use FA or EN",
                400
            )
        }

        const search = typeof req.query.search === "string" ? req.query.search  : undefined
        const categoryId = req.query.categoryId !== undefined ? Number(req.query.categoryId) : undefined
        const teacherId = req.query.teacherId !== undefined ? Number(req.query.teacherId) : undefined
        const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "popular" 
        const sortOrder = req.query.sortOrder !== undefined ? req.query.sortOrder : "desc"
        const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined
        const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined
        const priceType = typeof req.query.priceType === "string" ? req.query.priceType : undefined

        const page = req.query.page !== undefined ? Number(req.query.page) : 1
        const limit = req.query.limit !== undefined ? Number(req.query.limit) : 12

        if (!Number.isInteger(page) || page < 1) {
            throw new AppError(
                "Invalid page",
                400
            );
        }

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            throw new AppError(
                "Limit must be between 1 and 100",
                400
            );
        }

        if (
            teacherId !== undefined &&
            (!Number.isInteger(teacherId) || teacherId <= 0)
        ) {
            throw new AppError(
                "Invalid teacherId",
                400
            );
        }

        if (
            categoryId !== undefined &&
            (!Number.isInteger(categoryId) || categoryId <= 0)
        ) {
            throw new AppError(
                "Invalid categoryId",
                400
            );
        }

        if (sortOrder !== "asc" && sortOrder !== "desc") {
            throw new AppError(
                "Invalid sortOrder",
                400
            );
        }

        if (
            minPrice !== undefined &&
            (!Number.isInteger(minPrice) || minPrice < 0)
        ) {
            throw new AppError(
                "Invalid minPrice",
                400
            );
        }

        if (
            maxPrice !== undefined &&
            (!Number.isInteger(maxPrice) || maxPrice < 0)
        ) {
            throw new AppError(
                "Invalid maxPrice",
                400
            );
        }

        if(
            minPrice !== undefined &&
            maxPrice !== undefined &&
            minPrice > maxPrice
        ){
            throw new AppError(
                "minPrice can not be greater than maxPrice",
                400
            )
        }

        if (
            priceType !== undefined &&
            priceType !== "FREE" &&
            priceType !== "PAID"
        ) {
            throw new AppError(
                "Invalid priceType",
                400
            );
        }

        if (search && search.length > 100) {
            throw new AppError(
                "Search query is too long",
                400
            );
        }

        if (!allowedSorts.includes(sortBy as typeof allowedSorts[number])) {
         throw new AppError("Invalid sortBy", 400);
        }

        const result = await getAllCourses(page , limit, search, categoryId, teacherId , minPrice, maxPrice, priceType , sortBy , sortOrder, lang)

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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

        const lang = typeof req.query.lang === "string" ? req.query.lang : Language.FA

        if (lang !== Language.FA && lang !== Language.EN) {
            throw new AppError(
                "Invalid language. use FA or EN",
                400
            )
        }

        const course = await getCourseByIdService(courseId, lang)

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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

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

        const lang = typeof req.query.lang === "string" ? req.query.lang : Language.FA

        if (lang !== Language.FA && lang !== Language.EN) {
            throw new AppError(
                "Invalid language. use FA or EN",
                400
            )
        }

        const userId = req.user.id

        const courses = await getPurchasedCourses(userId, lang)

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


        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

        const favorite  = await addFavorite(userId, courseId)

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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
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

        const lang = typeof req.query.lang === "string" ? req.query.lang : Language.FA

        if (lang !== Language.FA && lang !== Language.EN) {
            throw new AppError(
                "Invalid language. use FA or EN",
                400
            )
        }

        const favorites = await getFavorites(userId, lang)

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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
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
        
        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
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

        if(!userId){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
        }

        const { content } = req.body

        const comment = await createComment(
            userId, 
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

        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new AppError("Invalid course ID", 400);
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

        if(!userId){
            throw new AppError(
                "Authentication required",
                401
            )
        }

        if (!Number.isInteger(commentId) || commentId <= 0) {
            throw new AppError("Invalid comment ID", 400);
        }

        const { content } = req.body

        const reply = await createReply(
            userId,
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

    if(!userId){
        throw new AppError(
            "Authentication required", 
            401
        )
    }

    if (!Number.isInteger(commentId) || commentId <= 0) {
        throw new AppError("Invalid comment ID", 400);
    }

    const like = await likeComment(
        userId,
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

        if (!Number.isInteger(commentId) || commentId <= 0) {
            throw new AppError("Invalid comment ID", 400);
        }

        await unlikeComment(
            userId,
            commentId
        )

        return res.status(200).json({
            message: "Comment unliked successfully"
        })

    }catch(error){
        next(error)
    }
}


export const uploadThumbnail = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try{
        if(!req.file){
            throw new AppError(
                "Course thumbnail is required",
                400
            )
        }

        const course = await uploadThumbnailService(
            Number(req.params.id),
            req.user!.id,
            req.file
        )

        return res.status(201).json({
            message: "course thuumbnail uploaded successfully",
            course
        })

    }catch(error){
        next(error)
    }
}