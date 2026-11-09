import { z } from "zod"

export const createOrderSchema = z.object({
    courseId: z.number().int().positive(),
})

export const guestCheckoutSchema = z.object({
  guestName: z.string().trim().min(2).max(100),

  guestPhone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "Invalid phone number"),

  guestEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal("")),

  courseIds: z
    .array(z.number().int().positive())
    .min(1),
});