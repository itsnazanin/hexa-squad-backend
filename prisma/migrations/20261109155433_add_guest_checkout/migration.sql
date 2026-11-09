/*
  Warnings:

  - A unique constraint covering the columns `[orderId,courseId]` on the table `PurchasedCourse` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasedCourse" DROP CONSTRAINT "PurchasedCourse_userId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PurchasedCourse" ADD COLUMN     "orderId" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Order_guestPhone_idx" ON "Order"("guestPhone");

-- CreateIndex
CREATE INDEX "PurchasedCourse_orderId_idx" ON "PurchasedCourse"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedCourse_orderId_courseId_key" ON "PurchasedCourse"("orderId", "courseId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedCourse" ADD CONSTRAINT "PurchasedCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedCourse" ADD CONSTRAINT "PurchasedCourse_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
