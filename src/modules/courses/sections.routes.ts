import { Router } from "express"
import { authMiddleware } from "../../common/middlewares/auth.middleware"
import { requireRole } from "../../common/middlewares/role.middleware"
import { Role } from "../../generated/prisma/enums"
import { validate } from "../../common/middlewares/validate.middleware"
import { createSectionSchema } from "./courses.schema"
import { createSection, deleteSectionController, getSections, updateSectionController } from "./sections.controller"
import { updatedSectionSchema } from "./sections.schema"


const router = Router()

router.post("/:courseId/sections", authMiddleware , requireRole(Role.TEACHER), validate(createSectionSchema), createSection )
router.get("/:courseId/sections", getSections)
router.put("/sections/:sectionId" , authMiddleware , requireRole("TEACHER") , validate(updatedSectionSchema) , updateSectionController)
router.delete("/sections/:sectionId" , authMiddleware , requireRole("TEACHER") , deleteSectionController)


export default router;
