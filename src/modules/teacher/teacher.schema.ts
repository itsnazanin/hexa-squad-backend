import { z } from "zod";

const languageSchema = z.enum(["FA","EN"])

const teacherTranslationSchema = z.object({
    language: languageSchema,
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    bio: z.string().trim().min(10, "Bio bust be at least 10 characters")
})

export const becomeTeacherSchema = z.object({
    translations: z.array(teacherTranslationSchema).length(2),
    avatar: z.string().trim().optional()
})

export const updateTeacherSchema = z.object({
    translations: z.array(teacherTranslationSchema).max(2).optional(),
    bio: z.string().trim().min(10).optional()
})