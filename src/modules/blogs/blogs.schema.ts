import {z} from "zod"

const languageSchema = z.enum([
  "FA",
  "EN"
])

const blogTranslationSchema = z.object({
  language: languageSchema,
  title: z.string().min(3),
  shortDescription: z.string().min(10),
  content: z.string().min(20)
})


export const createBlogSchema = z.object({
 translations: z.array(
  blogTranslationSchema
 ).length(2),
 coverImage: z.string().trim().min(1),
 blogImage: z.string().trim().optional(),
 author: z.string().trim().min(1) 
})

export const updateBlogSchema = z.object({
  translations: z.array(
    blogTranslationSchema
  ).max(2).optional(),
  coverImage: z.string().trim().min(1).optional(),
  blogImage: z.string().trim().optional(),
  author: z.string().trim().min(2).optional(),
});

export const blogReactionSchema = z.object({
  type: z.enum(["LIKE", "DISLIKE"]),
});


export type CreateBlogInput = z.infer<typeof createBlogSchema>

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>