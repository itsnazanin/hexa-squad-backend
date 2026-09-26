import { z } from "zod"

const languageSchema = z.enum([
  "FA",
  "EN"
])

const lessonTranslationSchema = z.object({
  language: languageSchema,
  title: z.string().min(1)
})

export const createLessonSchema = z.object({
  translations: z.array(
    lessonTranslationSchema
  ).length(2),

  duration: z.number().int().positive(),

  order: z.number().int().positive()
})

export const updateLessonSchema = z.object({
  translations: z.array(
    lessonTranslationSchema
  ).max(2).optional(),

  duration: z.number().int().positive().optional(),

  order: z.number().int().positive().optional()
})

export type CreateLessonInput =
  z.infer<typeof createLessonSchema>

export type UpdateLessonInput =
  z.infer<typeof updateLessonSchema>