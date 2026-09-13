import { z } from "zod"

export const createOrderSchema = z.object({
    courseId: z.number().int().positive(),
})