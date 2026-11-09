import { z } from 'zod'; 

export const registerSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6)
}).refine(
    (data) => data.email || data.phone,
    {
        message: "Email or phone is required",
        path:["email"]
    }
)


export const loginSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(8)
}).refine(
    (data) => Boolean(data.email) || Boolean(data.phone) ,
    {
        message: "Email or phone is requaired"
    }
)


export const verifyLoginOtpSchema = z.object({
  identifier: z.string().trim().min(1),
  method: z.enum(["email", "phone"]),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
})

export const resendLoginOtpSchema = loginSchema;
