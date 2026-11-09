import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma"
import { AppError } from "../../common/errors/AppErrors";
import { VerifectionPurpose } from "../../generated/prisma/client";
import { createOtp, verifyOtp } from "../auth/otp.service";
import { sendOtpEmail } from "../auth/email.service";
import { sendOtpSms } from "../auth/sms.service";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type RegisterData = {
    name?: string,
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
    const name = data.name?.trim() || undefined
    const email = data.email?.trim().toLowerCase() || undefined
    const phone = data.phone?.trim() || undefined
    const { password } = data

    if (!name || name.length < 2) {
     throw new AppError("Name must be at least 2 characters", 400);
    }

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
            name: name ?? null,
            email: email ?? null,
            phone: phone ?? null,
            password: hashedPassword
        }
    })

    const accessToken = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: "7d"}
    )

    const { password: _password, nationalCode: _nationalCode , ...safeUser } = user;

    return {
      user: safeUser,
      accessToken
    }
}   


export const loginUser = async (data: LoginData) => {
  const email = data.email?.trim().toLowerCase();
  const phone = data.phone?.trim();

  if (!email && !phone) {
    throw new AppError("Email or phone is required", 400);
  }

  const method = email ? "email" : "phone";
  const identifier = email ?? phone!;

  const user = email ?
   await prisma.user.findFirst({
    where: { email } 
   })
   : await prisma.user.findFirst({
    where: { phone: phone!}
   })

  if (!user) {
    throw new AppError(
      "Invalid email/phone or password",
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email/phone or password",
      401
    );
  }

  // Send OTP instead of issuing a JWT here.
  await sendLoginOtp(identifier, method);

  return {
    otpRequired: true,
    method,
    identifier,
  };
};


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


const sendLoginOtp = async (
  identifier: string,
  method: "email" | "phone"
) => {
  const normalizedIdentifier =
    method === "email"
      ? identifier.trim().toLowerCase()
      : identifier.trim();

  const { code } = await createOtp(
    normalizedIdentifier,
    VerifectionPurpose.LOGIN
  );

  try {
    if (method === "email") {
      await sendOtpEmail(normalizedIdentifier, code);
    } else {
      await sendOtpSms(normalizedIdentifier, code);
    }
  } catch {
    await prisma.verifectionCode.updateMany({
      where: {
        identifier: normalizedIdentifier,
        purpose: VerifectionPurpose.LOGIN,
        consumedAt: null,
      },
      data: {
        consumedAt: new Date(),
      },
    });

    throw new AppError(
      "Failed to send verification code",
      502
    );
  }
};



type VerifyLoginOtpData = {
  identifier: string;
  method: "email" | "phone";
  code: string;
};

export const verifyLoginOtp = async (
  data: VerifyLoginOtpData
) => {
  const identifier =
    data.method === "email"
      ? data.identifier.trim().toLowerCase()
      : data.identifier.trim();

  const user = await prisma.user.findFirst({
    where:
      data.method === "email"
        ? { email: identifier }
        : { phone: identifier },
  });

  if (!user) {
    throw new AppError("Invalid verification request", 400);
  }

  await verifyOtp(
    identifier,
    VerifectionPurpose.LOGIN,
    data.code
  );


  const accessToken = jwt.sign(
    { userId: user.id },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken };
};
