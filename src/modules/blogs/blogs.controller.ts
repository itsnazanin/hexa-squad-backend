import { NextFunction , Response , Request } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { addBlogFavorite, createBlog, createBlogComment, createBlogReply, deleteBlog, getAllBlogs, getBlogById, getBlogComments, likeBlogComment, likeDislikeBlog, removeBlogFavorite, removeBlogReaction, unlikeBlogComment, updateBlog } from "./blogs.service";


export const createBlogController = async (req: AuthRequest,res: Response , next:NextFunction) => {
  try {
    const blog = await createBlog(req.body);

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    next(error)
  }
};

export const getAllBlogsController = async (req:Request , res:Response , next:NextFunction) => {
    try{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const search = typeof req.query.search === "string"
        ? req.query.search
        : undefined

        const result = await getAllBlogs(page , limit , search)

        return res.status(200).json({
            result
        })

    }catch(error){
        next(error)
    }
}

export const getBlogByIdController = async ( req: Request, res: Response , next:NextFunction ) => {
  try {
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await getBlogById(blogId);

    return res.status(200).json({
      blog,
    });
  } catch (error) {
    next(error)
  }
};


export const updateBlogController = async (req: Request, res: Response , next:NextFunction) => {
  try {
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await updateBlog(
      blogId,
      req.body
    );

    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    next(error)
  }
};

export const deleteBlogController = async (req: Request, res: Response , next:NextFunction) => {
  try {
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    await deleteBlog(blogId);

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error)
  }
};


export const createBlogCommentController = async (req: AuthRequest, res: Response , next:NextFunction ) => {
  try {
    const userId = req.user?.id;
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const comment = await createBlogComment(
      userId as number,
      blogId,
      req.body.content
    );

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    next(error)
  }
};


export const getBlogCommentsController = async (req: Request, res: Response , next:NextFunction ) => {
  try {
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const comments = await getBlogComments(blogId);

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};


export const createBlogReplyController = async (req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const commentId = Number(req.params.commentId);

    if (Number.isNaN(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const reply = await createBlogReply(
      userId as number,
      commentId,
      req.body.content
    );

    return res.status(201).json({
      message: "Reply created successfully",
      reply,
    });
  } catch (error) {
    next(error)
  }
};


export const likeBlogCommentController = async ( req: AuthRequest,res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const commentId = Number(req.params.commentId);

    if (Number.isNaN(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const like = await likeBlogComment(
      userId as number,
      commentId
    );

    return res.status(201).json({
      message: "Comment liked successfully",
      like,
    });
  } catch (error) {
   next(error)
  }
};


export const unlikeBlogCommentController = async ( req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const commentId = Number(req.params.commentId);

    if (Number.isNaN(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    await unlikeBlogComment(
      userId as number,
      commentId
    );

    return res.status(200).json({
      message: "Comment unliked successfully",
    });
  } catch (error) {
    next(error)
  }
};


export const likeDislikeBlogController = async (req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const reaction = await likeDislikeBlog(
      userId as number,
      blogId,
      req.body.type
    );

    return res.status(200).json({
      message: "Reaction updated successfully",
      reaction,
    });
  } catch (error) {
    next(error)
  }
};



export const removeBlogReactionController = async ( req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    await removeBlogReaction(userId as number, blogId);

    return res.status(200).json({
      message: "Reaction removed successfully",
    });
  } catch (error) {
   next(error)
  }
};


export const addBlogFavoriteController = async ( req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const favorite = await addBlogFavorite(
      userId as number,
      blogId
    );

    return res.status(201).json({
      message: "Blog added to favorites successfully",
      favorite,
    });
  } catch (error) {
     next(error)
  }
};



export const removeBlogFavoriteController = async ( req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const blogId = Number(req.params.blogId);

    if (Number.isNaN(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    await removeBlogFavorite(
      userId as number,
      blogId
    );

    return res.status(200).json({
      message: "Blog removed from favorites successfully",
    });
  } catch (error) {
   next(error)
  }
};