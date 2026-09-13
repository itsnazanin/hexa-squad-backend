import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { addBlogFavoriteController, createBlogCommentController, createBlogController, createBlogReplyController, deleteBlogController, getAllBlogsController, getBlogByIdController, getBlogCommentsController, likeBlogCommentController, likeDislikeBlogController, removeBlogFavoriteController, removeBlogReactionController, unlikeBlogCommentController, updateBlogController } from "./blogs.controller";
import { blogReactionSchema, createBlogSchema, updateBlogSchema } from "./blogs.schema";
import { createCommentSchema } from "../courses/courses.schema";

const router = Router()

router.post("/", authMiddleware , validate(createBlogSchema) , createBlogController)
router.get("/", getAllBlogsController)
router.get("/:blogId",getBlogByIdController);
router.put("/:blogId",authMiddleware,validate(updateBlogSchema),updateBlogController);
router.delete("/:blogId",authMiddleware,deleteBlogController);
router.post("/:blogId/comments", authMiddleware, validate(createCommentSchema),createBlogCommentController);
router.get("/:blogId/comments", getBlogCommentsController);
router.post("/comments/:commentId/replies", authMiddleware , validate(createCommentSchema), createBlogReplyController)
router.post("/comments/:commentId/like", authMiddleware, likeBlogCommentController);
router.delete("/comments/:commentId/like", authMiddleware, unlikeBlogCommentController);
router.post( "/:blogId/reaction", authMiddleware, validate(blogReactionSchema),likeDislikeBlogController);
router.delete( "/:blogId/reaction", authMiddleware, removeBlogReactionController);
router.post("/:blogId/favorite", authMiddleware, addBlogFavoriteController);
router.delete("/:blogId/favorite", authMiddleware, removeBlogFavoriteController);

export default router
