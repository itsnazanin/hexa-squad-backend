import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma"
import { AppError } from "../../common/errors/AppErrors";
import jwt from "jsonwebtoken";

type RegisterData = {
    name: string,
    email?: string,
    phone?: string,
    password: string
}

type LoginData = {
    email?: string,
    phone?: string,
    password: string
}

export const registerUser = async (data: RegisterData) => {
    const { name, email, phone, password } = data;

    if(!email && !phone) {
        throw new AppError("Email or phone is required", 400);
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
              ...(email ? [{ email }] : []),
              ...(phone ? [{ phone }] : [])
            ]
        }
    })

    if(existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10)


    const user = await prisma.user.create({
        data:{
            name,
            email: email ?? null,
            phone: phone ?? null,
            password: hashedPassword
        }
    })

    const { password: _, ...safeUser } = user;
    return safeUser;
}   



export const loginUser = async (data: LoginData) => {

    const { email , phone , password } = data


    if (!email && !phone){
        throw new AppError(
            "Email or phone is required",
            400)
    }

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ phone }] : [])
            ]
        }
    })

    if(!user){
     throw new AppError(
            "Invalid email/phone or password",
            401
        )
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    )

    if (!isPasswordValid) {
    throw new AppError(
        "Invalid email/phone or password",
        401
    )
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d"}
    )

    return {
        accessToken: token
    }
}

export const getProfileUser = async (data : number) => {
    const userData = await prisma.user.findUnique({
        where: {
            id: data
        },
        select : {
            id: true,
            avatar: true,
            name: true,
            birthDate: true,
            phone: true,
            email: true,
            nationalCode: true,

        }
    })

    if(!userData){
        throw new AppError(
            "User not found",
            404
        )
    }

    return userData
}