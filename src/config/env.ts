import "dotenv/config";

const requiredEnv = [
    "DATABASE_URL",
    "JWT_SECRET",
    "FRONTEND_URL"
] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`${key} is missing`);
    }
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    FRONTEND_URL: process.env.FRONTEND_URL!
};