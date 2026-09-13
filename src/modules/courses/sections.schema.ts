import { z } from "zod"


export const updatedSectionSchema = z.object({
    title: z.string().min(1).optional(),
    order: z.coerce.number().int().positive().optional()
})