import { z } from "zod"

const languageSchema = z.enum(["FA", "EN"])

const sectionTranslationSchema = z.object({
    language: languageSchema,
    title: z.string().min(1)
})

export const createSectionSchema = z.object({
    translations: z.array(
        sectionTranslationSchema
    ).length(2),

    order: z.number().int().positive()
})

export const updateSectionSchema = z.object({
    translations: z.array(
        sectionTranslationSchema
    ).max(2).optional(),

    order: z.number().int().positive().optional()
})

export type CreateSectionInput =
    z.infer<typeof createSectionSchema>

export type UpdateSectionInput =
    z.infer<typeof updateSectionSchema>