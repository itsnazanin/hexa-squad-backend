import { z } from "zod";

export const becomeTeacherSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    avatar: z.string().min(1, "Avatar is required")
})

export const updateTeacherSchema = z.object({
    name: z.string().trim().min(2).optional(),
    avatar: z.string().trim().optional(),
    bio: z.string().trim().min(10).optional()
})