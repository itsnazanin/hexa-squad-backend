import { Router } from "express"
import { authMiddleware } from "../../common/middlewares/auth.middleware"
import { requireRole } from "../../common/middlewares/role.middleware"
import { Role } from "../../generated/prisma/enums"
import { createLessons, deleteLesson, getSectionLessons, updateLesson } from "./lessons.controller"
import { validate } from "../../common/middlewares/validate.middleware"
import { createLessonSchema, updateLessonSchema } from "./lessons.schema"
import { courseAccessMiddleware } from "../../common/middlewares/course-access.middleware"

const router = Router()

router.post("/sections/:sectionId/lessons" , authMiddleware , requireRole(Role.TEACHER), validate(createLessonSchema) , createLessons)
router.get("/sections/:sectionId/lessons", authMiddleware , courseAccessMiddleware , getSectionLessons)
router.patch("/lessons/:id", authMiddleware , requireRole(Role.TEACHER), validate(updateLessonSchema), updateLesson)
router.delete("/lessons/:id", authMiddleware , requireRole(Role.TEACHER), deleteLesson)

export default router;