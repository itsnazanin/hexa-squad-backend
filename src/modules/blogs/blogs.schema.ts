import {z} from "zod"


export const createBlogSchema = z.object({
 title: z.string().trim().min(3),
 coverImage: z.string().trim().min(1),
 blogImage: z.string().trim().optional(),
 shortDescription: z.string().trim().min(10),
 content: z.string().trim().min(20),
 author: z.string().trim().min(2) 
})

export const updateBlogSchema = z.object({
  title: z.string().trim().min(3).optional(),
  coverImage: z.string().trim().min(1).optional(),
  blogImage: z.string().trim().optional(),
  shortDescription: z.string().trim().min(10).optional(),
  content: z.string().trim().min(20).optional(),
  author: z.string().trim().min(2).optional(),
});

export const blogReactionSchema = z.object({
  type: z.enum(["LIKE", "DISLIKE"]),
});