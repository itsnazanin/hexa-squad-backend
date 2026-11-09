-- CreateEnum
CREATE TYPE "VerifectionPurpose" AS ENUM ('LOGIN', 'REGISTER');

-- CreateTable
CREATE TABLE "VerifectionCode" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "purpose" "VerifectionPurpose" NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifectionCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerifectionCode_identifier_purpose_idx" ON "VerifectionCode"("identifier", "purpose");

-- CreateIndex
CREATE INDEX "VerifectionCode_expiresAt_idx" ON "VerifectionCode"("expiresAt");
