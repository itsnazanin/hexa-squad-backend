import { Router } from "express"
import { authMiddleware } from "../../common/middlewares/auth.middleware"
import { requireRole } from "../../common/middlewares/role.middleware"
import { Role } from "../../generated/prisma/enums"
import { createLessons, deleteLesson, deleteLessonFileController, downloadLessonFileController, getLessonFilesController, getSectionLessons, updateLesson, uploadFile } from "./lessons.controller"
import { validate } from "../../common/middlewares/validate.middleware"
import { createLessonSchema, updateLessonSchema } from "./lessons.schema"
import { courseAccessMiddleware } from "../../common/middlewares/course-access.middleware"
import { uploadLessonFile } from "../../common/middlewares/upload.middleware"

const router = Router()

router.post("/sections/:sectionId/lessons" , authMiddleware , requireRole(Role.TEACHER), validate(createLessonSchema) , createLessons)
router.get("/sections/:sectionId/lessons", authMiddleware , courseAccessMiddleware , getSectionLessons)
router.patch("/:id", authMiddleware , requireRole(Role.TEACHER), validate(updateLessonSchema), updateLesson)
router.delete("/:id", authMiddleware , requireRole(Role.TEACHER), deleteLesson)
router.post("/:id/files",authMiddleware,requireRole("TEACHER"), uploadLessonFile.single("file"), uploadFile);
router.get("/:lessonId/files", authMiddleware,courseAccessMiddleware, getLessonFilesController);
router.get("/:lessonId/files/:fileId/download",authMiddleware,courseAccessMiddleware,downloadLessonFileController);
router.delete("/:lessonId/files/:fileId",authMiddleware,requireRole("TEACHER"),deleteLessonFileController);

export default router;