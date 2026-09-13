import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { createCommentSchema, createCourseSchema, createReviewSchema, updateCourseSchema } from "./courses.schema";
import { addFavoriteController, createCommentController, createCourse, createReplyController, createReviewController, deleteCourse, deleteReviewController, getCourseById, getCourseCommentsController, getCourseReviewsController, getCourses, getFavoritesController, getPurchasedCoursesController, likeCommentController, removeFavoriteController, unlikeCommentController, updateCourse, updateReviewController } from "./courses.controller";
import { Role } from "../../generated/prisma/enums";
import { courseAccessMiddleware } from "../../common/middlewares/course-access.middleware";

const router = Router()

router.post("/",authMiddleware , requireRole(Role.TEACHER) , validate(createCourseSchema), createCourse)
router.get("/", getCourses)
router.patch("/:id", authMiddleware , requireRole(Role.TEACHER),validate(updateCourseSchema), updateCourse)
router.delete("/:id", authMiddleware , requireRole(Role.TEACHER),deleteCourse)
router.get("/purchased" , authMiddleware , courseAccessMiddleware , requireRole(Role.STUDENT) , getPurchasedCoursesController)
router.get("/:id" , getCourseById)  
router.post("/:courseId/favorite" , authMiddleware , addFavoriteController)
router.delete("/:courseId/favorite" , authMiddleware , removeFavoriteController)
router.get("/favorites" , authMiddleware , getFavoritesController)
router.post("/:courseId/reviews" , authMiddleware , validate(createReviewSchema), createReviewController)
router.get("/:courseId/reviews" , getCourseReviewsController)
router.put("/:courseId/reviews" , authMiddleware , validate(createReviewSchema) , updateReviewController)
router.delete("/:courseId/reviews" , authMiddleware , deleteReviewController)
router.post("/:courseId/comments" , authMiddleware , validate(createCommentSchema) , createCommentController)
router.get("/:courseId/comments" , getCourseCommentsController)
router.post("/comments/:commentId/reply", authMiddleware , validate(createCommentSchema), createReplyController)
router.post("/comments/:commentId/like" , authMiddleware , likeCommentController)
router.delete("/comments/:commentId/like" , authMiddleware , unlikeCommentController)


export default router