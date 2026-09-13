import { title } from "node:process"
import { string, z } from "zod"

export const createLessonSchema = z.object({
    title: z.string().min(1),
    duration: z.number().int().positive(),
    order: z.number().int().positive()
})


export const updateLessonSchema = z.object({
    title: z.string().min(3).optional(),
    duration: z.number().int().positive().optional(),
    order: z.number().int().positive().optional()
})