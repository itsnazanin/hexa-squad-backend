import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { becomeTeacherSchema, updateTeacherSchema } from "./teacher.schema";
import { validate } from "../../common/middlewares/validate.middleware";
import becomeTeacher, { getMyTeacherProfile, getTeachersController, updateTeacherController , uploadAvatar , deleteAvatar } from "./teacher.controller";
import { requireRole } from "../../common/middlewares/role.middleware";
import { uploadTeacherAvatar } from "../../common/middlewares/upload.middleware";



const router = Router()

router.post( "/" ,authMiddleware , validate(becomeTeacherSchema), becomeTeacher)
router.get( "/me" , authMiddleware , getMyTeacherProfile)
router.get("/", getTeachersController)
router.put("/me" , authMiddleware , requireRole("TEACHER") , validate(updateTeacherSchema) , updateTeacherController)
router.post("/:teacherId/avatar",authMiddleware, requireRole("TEACHER"), uploadTeacherAvatar.single("avatar"), uploadAvatar)
router.delete("/:teacherId/avatar",authMiddleware, requireRole("TEACHER"), deleteAvatar)

export default router;