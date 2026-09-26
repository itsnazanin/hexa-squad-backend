import { Router } from "express"
import { authMiddleware } from "../../common/middlewares/auth.middleware"
import { requireRole } from "../../common/middlewares/role.middleware"
import { Role } from "../../generated/prisma/enums"
import { validate } from "../../common/middlewares/validate.middleware"
import { createSectionSchema } from "./courses.schema"
import { createSection, deleteSectionController, getSections, updateSectionController } from "./sections.controller"
import { updateSectionSchema } from "./sections.schema"


const router = Router()

router.post("/:courseId/sections", authMiddleware , requireRole(Role.TEACHER), validate(createSectionSchema), createSection )
router.get("/:courseId/sections", getSections)
router.put("/:sectionId" , authMiddleware , requireRole("TEACHER") , validate(updateSectionSchema) , updateSectionController)
router.delete("/:sectionId" , authMiddleware , requireRole("TEACHER") , deleteSectionController)


export default router;
