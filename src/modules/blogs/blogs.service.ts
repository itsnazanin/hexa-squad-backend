import { AppError } from "../../common/errors/AppErrors";
import { prisma } from "../../config/prisma"
import { Language } from "../../generated/prisma/enums";
import { CreateBlogInput , UpdateBlogInput} from "./blogs.schema";
import fs from "fs/promises"
import path from "path"


export const createBlog = async (
  data: CreateBlogInput
) => {
  const blog = await prisma.blog.create({
    data: {
      coverImage: data.coverImage,
      author: data.author,

      ...(data.blogImage !== undefined && {
        blogImage: data.blogImage
      }),

      translations: {
        create: data.translations.map((translation) => ({
          language: translation.language,
          title: translation.title,
          shortDescription: translation.shortDescription,
          content: translation.content
        }))
      }
    },
  });

  return blog;
};

export const getAllBlogs = async (
  page: number,
  limit: number,
  search?: string,
  lang: Language = Language.FA
) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        translations: {
          some: {
            language: lang,
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive" as const
                }
              },
              {
                shortDescription: {
                  contains: search,
                  mode: "insensitive" as const
                }
              },
              {
                content: {
                  contains: search,
                  mode: "insensitive" as const
                }
              }
            ]
          }
        }
      }
    : {};

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        translations: {
          where: {
            language: lang
          }
        }
      }
    }),

    prisma.blog.count({
      where
    })
  ]);

  const formattedBlogs = blogs.map((blog) => {
    const translation = blog.translations[0];

    return {
      id: blog.id,
      coverImage: blog.coverImage,
      blogImage: blog.blogImage,
      viewCount: blog.viewCount,
      author: blog.author,

      title: translation?.title ?? "",
      shortDescription: translation?.shortDescription ?? "",
      content: translation?.content ?? "",

      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt
    };
  });

  return {
    blogs: formattedBlogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};


export const getBlogById = async ( blogId: number, lang: Language = Language.FA , userId?: number ) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
    include: {
      translations: {
        where: {
          language: lang,
        },
      },

      comments: {
        where: {
          parentId: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  const reactions = await prisma.blogReaction.groupBy({
    by:["type"],
    where: {
      blogId
    },
    _count: {
      _all : true
    }
  })

  const likeCount = reactions.find((item) => item.type === "LIKE")?._count._all ?? 0

  const dislikeCount = reactions.find((item) => item.type === "DISLIKE")?._count._all ?? 0

  const userReaction = userId
  ? await prisma.blogReaction.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId
      }
    }, select: {
      type: true
    }
  }) : null

  await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  return {
    ...blog,
    viewCount: blog.viewCount + 1,
    likeCount,
    dislikeCount,
    userReaction: userReaction?.type ?? null
  };
};


export const updateBlog = async (
  blogId: number,
  data: UpdateBlogInput
) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId
    }
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
      404
    );
  }

  const updatedBlog = await prisma.blog.update({
    where: {
      id: blogId
    },

    data: {
      ...(data.coverImage !== undefined && {
        coverImage: data.coverImage
      }),

      ...(data.blogImage !== undefined && {
        blogImage: data.blogImage
      }),

      ...(data.author !== undefined && {
        author: data.author
      }),

      ...(data.translations !== undefined && {
        translations: {
          upsert: data.translations.map((translation) => ({
            where: {
              blogId_language: {
                blogId,
                language: translation.language
              }
            },

            update: {
              title: translation.title,
              shortDescription: translation.shortDescription,
              content: translation.content
            },

            create: {
              language: translation.language,
              title: translation.title,
              shortDescription: translation.shortDescription,
              content: translation.content
            }
          }))
        }
      })
    }
  });

  return updatedBlog;
};


export const deleteBlog = async (blogId: number) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
      404);
  }

  await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });
};


export const createBlogComment = async (
  userId: number,
  blogId: number,
  content: string
) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
      404);
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      userId,
      blogId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return comment;
};

export const getBlogComments = async (blogId: number) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
      404
    );
  }

  const comments = await prisma.comment.findMany({
    where: {
      blogId,
      parentId: null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};


export const createBlogReply = async (userId: number, commentId: number, content: string) => {

  const parentComment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!parentComment) {
    throw new AppError(
      "Comment not found",
      404
    );
  }

  if (!parentComment.blogId) {
    throw new AppError(
      "This comment does not belong to a blog",
      400
    );
  }

  const reply = await prisma.comment.create({
    data: {
      content,
      userId,
      blogId: parentComment.blogId,
      parentId: parentComment.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return reply;
};



export const likeBlogComment = async ( userId: number, commentId: number) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new AppError(
      "Comment not found",
      404
    );
  }

  if (!comment.blogId) {
    throw new AppError(
      "This comment does not belong to a blog",
      400
    );
  }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (existingLike) {
    throw new AppError(
      "Comment already liked",
    400
  );
  }

  const like = await prisma.commentLike.create({
    data: {
      userId,
      commentId,
    },
  });

  return like;
};



export const unlikeBlogComment = async (
  userId: number,
  commentId: number
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new AppError(
      "Comment not found" ,
       404
      );
  }

  if (!comment.blogId) {
    throw new AppError(
      "This comment does not belong to a blog",
      400
    );
  }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (!existingLike) {
    throw new AppError(
      "Comment is not liked",
      400
    );
  }

  await prisma.commentLike.delete({
    where: {
      id: existingLike.id,
    },
  });
};



export const likeDislikeBlog = async ( userId: number, blogId: number, type: "LIKE" | "DISLIKE") => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
      404
    );
  }

  const existingReaction = await prisma.blogReaction.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });

  if (existingReaction) {
    const updatedReaction = await prisma.blogReaction.update({
      where: {
        id: existingReaction.id,
      },
      data: {
        type,
      },
    });

    return updatedReaction;
  }

  const reaction = await prisma.blogReaction.create({
    data: {
      userId,
      blogId,
      type,
    },
  });

  return reaction;
};



export const removeBlogReaction = async ( userId: number, blogId: number) => {
  const reaction = await prisma.blogReaction.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });

  if (!reaction) {
    throw new AppError(
      "Reaction not found",
      404
  );
  }

  await prisma.blogReaction.delete({
    where: {
      id: reaction.id,
    },
  });
};



export const addBlogFavorite = async ( userId: number, blogId: number) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
    404
  );
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });

  if (existingFavorite) {
    throw new AppError(
      "Blog already in favorites",
      409
    );
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId,
      blogId,
      createdAt: new Date(),
    },
  });

  return favorite;
};



export const removeBlogFavorite = async ( userId: number, blogId: number) => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });

  if (!favorite) {
    throw new AppError(
      "Blog is not in favorites",
      404
    );
  }

  await prisma.favorite.delete({
    where: {
      id: favorite.id,
    },
  });
};


export const uploadBlogCover = async ( blogId: number, file: Express.Multer.File) => {

  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
      404
    );
  }

  if (blog.coverImage) {
    const oldImagePath = path.join(
      process.cwd(),
      "src",
      blog.coverImage.replace(/^\/+/, "")
    );

    try {
      await fs.unlink(oldImagePath);
    } catch {
      // Old image does not exist on disk
    }
  }

  const imagePath = `/uploads/blogs/${file.filename}`;

  const updatedBlog = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: {
      coverImage: imagePath,
    },
  });

  return updatedBlog;
};



export const uploadBlogImage = async (
  blogId: number,
  file: Express.Multer.File
) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new AppError(
      "Blog not found",
      404
    );
  }

  if (blog.blogImage) {
    const oldImagePath = path.join(
      process.cwd(),
      "src",
      blog.blogImage.replace(/^\/+/, "")
    );

    try {
      await fs.unlink(oldImagePath);
    } catch {
      // Old image does not exist on disk
    }
  }

  const imagePath = `/uploads/blogs/${file.filename}`;

  const updatedBlog = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: {
      blogImage: imagePath,
    },
  });

  return updatedBlog;
};