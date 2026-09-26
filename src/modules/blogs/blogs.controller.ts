import { NextFunction , Response , Request } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { addBlogFavorite, createBlog, createBlogComment, createBlogReply, deleteBlog, getAllBlogs, getBlogById, getBlogComments, likeBlogComment, likeDislikeBlog, removeBlogFavorite, removeBlogReaction, unlikeBlogComment, updateBlog, uploadBlogCover as uploadBlogCoverService ,  uploadBlogImage as uploadBlogImageService } from "./blogs.service";
import { AppError } from "../../common/errors/AppErrors";
import { Language } from "../../generated/prisma/enums";


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

        const search = typeof req.query.search === "string" ? req.query.search : undefined

        const lang = typeof req.query.lang === "string" ? req.query.lang : Language.FA

        if(lang !== Language.FA && lang !== Language.EN) {
          throw new AppError(
            "Invalid language use FA or EN",
            400
          )
        }

        const result = await getAllBlogs(page , limit , search, lang)

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

    if (!Number.isInteger(blogId) || blogId <= 0) {
        throw new AppError("Invalid blog ID", 400);
    }

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

    const blog = await getBlogById(blogId,lang);

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

    if (!Number.isInteger(blogId) || blogId <= 0) {
    throw new AppError("Invalid blog ID", 400);
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

    if (!Number.isInteger(blogId) || blogId <= 0) {
        throw new AppError("Invalid blog ID", 400);
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

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(blogId) || blogId <= 0) {
    throw new AppError("Invalid blog ID", 400);
    }

    const comment = await createBlogComment(
      userId,
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

    if (!Number.isInteger(blogId) || blogId <= 0) {
        throw new AppError("Invalid blog ID", 400);
    }

    const comments = await getBlogComments(blogId);

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    next(error)
     
  }
};


export const createBlogReplyController = async (req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const commentId = Number(req.params.commentId);

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(commentId) || commentId <= 0) {
        throw new AppError("Invalid comment ID", 400);
    }

    const reply = await createBlogReply(
      userId,
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

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(commentId) || commentId <= 0) {
        throw new AppError("Invalid comment ID", 400);
    }

    const like = await likeBlogComment(
      userId,
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

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(commentId) || commentId <= 0) {
        throw new AppError("Invalid comment ID", 400);
    }

    await unlikeBlogComment(
      userId,
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

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(blogId) || blogId <= 0) {
        throw new AppError("Invalid blog ID", 400);
    }

    const reaction = await likeDislikeBlog(
      userId,
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

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(blogId) || blogId <= 0) {
        throw new AppError("Invalid blog ID", 400);
    }

    await removeBlogReaction(userId, blogId);

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

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(blogId) || blogId <= 0) {
    throw new AppError("Invalid blog ID", 400);
    }

    const favorite = await addBlogFavorite(
      userId,
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

    if (!userId) {
    throw new AppError("Authentication required", 401);
    }

    if (!Number.isInteger(blogId) || blogId <= 0) {
        throw new AppError("Invalid blog ID", 400);
    }

    await removeBlogFavorite(
      userId,
      blogId
    );

    return res.status(200).json({
      message: "Blog removed from favorites successfully",
    });
  } catch (error) {
   next(error)
  }
};


export const uploadCover = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new AppError(
        "Blog cover image is required",
        400
      );
    }

    const blogId = Number(req.params.id);

    if (!Number.isInteger(blogId) || blogId <= 0) {
      throw new AppError(
        "Invalid blog ID",
        400
      );
    }

    const blog = await uploadBlogCoverService(
      blogId,
      req.file
    );

    return res.status(200).json({
      message: "Blog cover image uploaded successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};



export const uploadImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new AppError(
        "Blog image is required",
        400
      );
    }

    const blogId = Number(req.params.id);

    if (
      !Number.isInteger(blogId) ||
      blogId <= 0
    ) {
      throw new AppError(
        "Invalid blog ID",
        400
      );
    }

    const blog = await uploadBlogImageService(
      blogId,
      req.file
    );

    return res.status(200).json({
      message: "Blog image uploaded successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};