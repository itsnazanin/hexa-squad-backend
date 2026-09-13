import {z} from "zod"

export const createCourseSchema = z.object({
    title: z.string().min(3),
    shortDescription: z.string().min(10),
    description: z.string().min(20),

    status: z.enum([
        "PENDING",
        "COMPLETED"
    ]),

    sections: z.array(
        z.object({
            title: z.string().min(1),

            order: z.number().int().positive(),

            lessons: z.array(
                z.object({
                    title: z.string().min(1),

                    duration: z.number().int().positive(),

                    order: z.number().int().positive()
                })
            )
        })
    ),

    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    courseTime: z.number().int().positive(),

    price: z.number().int().nonnegative(),
    categoryId: z.number().int().positive()
})

export type createCourseDataType = z.infer<typeof createCourseSchema>


export const updateCourseSchema = z.object({
    title:z.string().min(3).optional(),
    shortDescription: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    courseTime: z.number().positive().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    categoryId: z.number().int().positive().optional()
})


export const createSectionSchema = z.object({
    title: z.string().min(3),
    order: z.number().int().positive()
})


export const createReviewSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5),
})

export const createCommentSchema = z.object({
    content: z.string().trim().min(1).max(1000)
})