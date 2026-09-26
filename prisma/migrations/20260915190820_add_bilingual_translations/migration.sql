/*
  Warnings:

  - You are about to drop the column `content` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Teacher` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('FA', 'EN');

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "content",
DROP COLUMN "shortDescription",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "description",
DROP COLUMN "shortDescription",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "bio",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "CourseTranslation" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CourseTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherTranslation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "TeacherTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionTranslation" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "SectionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonTranslation" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "LessonTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTranslation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "BlogTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseTranslation_courseId_idx" ON "CourseTranslation"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseTranslation_courseId_language_key" ON "CourseTranslation"("courseId", "language");

-- CreateIndex
CREATE INDEX "TeacherTranslation_teacherId_idx" ON "TeacherTranslation"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherTranslation_teacherId_language_key" ON "TeacherTranslation"("teacherId", "language");

-- CreateIndex
CREATE INDEX "SectionTranslation_sectionId_idx" ON "SectionTranslation"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionTranslation_sectionId_language_key" ON "SectionTranslation"("sectionId", "language");

-- CreateIndex
CREATE INDEX "LessonTranslation_lessonId_idx" ON "LessonTranslation"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonTranslation_lessonId_language_key" ON "LessonTranslation"("lessonId", "language");

-- CreateIndex
CREATE INDEX "BlogTranslation_blogId_idx" ON "BlogTranslation"("blogId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTranslation_blogId_language_key" ON "BlogTranslation"("blogId", "language");

-- CreateIndex
CREATE INDEX "CategoryTranslation_categoryId_idx" ON "CategoryTranslation"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_language_key" ON "CategoryTranslation"("categoryId", "language");

-- AddForeignKey
ALTER TABLE "CourseTranslation" ADD CONSTRAINT "CourseTranslation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherTranslation" ADD CONSTRAINT "TeacherTranslation_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionTranslation" ADD CONSTRAINT "SectionTranslation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTranslation" ADD CONSTRAINT "LessonTranslation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTranslation" ADD CONSTRAINT "BlogTranslation_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
