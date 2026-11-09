import crypto from "node:crypto";
import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/AppErrors";
import { VerifectionPurpose } from "../../generated/prisma/client";

const OTP_EXPIRATION_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;

const generateOtp = (): string => {
    return crypto
        .randomInt(0, 1_000_000)
        .toString()
        .padStart(6, "0");
};

const hashOtp = (code: string): string => {
    return crypto
        .createHash("sha256")
        .update(code)
        .digest("hex");
};

export const createOtp = async (
    identifier: string,
    purpose: VerifectionPurpose
) => {
    const normalizedIdentifier = identifier.trim().toLowerCase();

    const code = generateOtp();

    const expiresAt = new Date(
        Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000
    );

    await prisma.$transaction([
        prisma.verifectionCode.updateMany({
            where: {
                identifier: normalizedIdentifier,
                purpose,
                consumedAt: null,
            },
            data: {
                consumedAt: new Date(),
            },
        }),

        prisma.verifectionCode.create({
            data: {
                identifier: normalizedIdentifier,
                purpose,
                codeHash: hashOtp(code),
                expiresAt,
            },
        }),
    ]);

    return {
        code,
        expiresAt,
    };
};

export const verifyOtp = async (
    identifier: string,
    purpose: VerifectionPurpose,
    submittedCode: string
) => {
    const normalizedIdentifier = identifier.trim().toLowerCase();

    const record = await prisma.verifectionCode.findFirst({
        where: {
            identifier: normalizedIdentifier,
            purpose,
            consumedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!record || record.expiresAt <= new Date()) {
        throw new AppError("Invalid or expired verification code", 400);
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
        throw new AppError("Too many verification attempts", 429);
    }

    const submittedHash = hashOtp(submittedCode);

    if (submittedHash !== record.codeHash) {
        await prisma.verifectionCode.update({
            where: {
                id: record.id,
            },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });

        throw new AppError("Invalid or expired verification code", 400);
    }

    await prisma.verifectionCode.update({
        where: {
            id: record.id,
        },
        data: {
            consumedAt: new Date(),
        },
    });

    return true;
};
