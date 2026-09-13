import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { becomeTeacherSchema, updateTeacherSchema } from "./teacher.schema";
import { validate } from "../../common/middlewares/validate.middleware";
import becomeTeacher, { getMyTeacherProfile, updateTeacherController } from "./teacher.controller";
import { requireRole } from "../../common/middlewares/role.middleware";


const router = Router()

router.post( "/" ,authMiddleware , validate(becomeTeacherSchema), becomeTeacher)
router.get( "/me" , authMiddleware , getMyTeacherProfile)
router.put("/me" , authMiddleware , requireRole("TEACHER") , validate(updateTeacherSchema) , updateTeacherController)

export default router;