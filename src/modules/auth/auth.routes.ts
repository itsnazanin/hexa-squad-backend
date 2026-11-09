import { Router } from 'express';
import { getProfile, login, register , verifyLogin , resendLoginCode } from './auth.controller';
import { validate } from '../../common/middlewares/validate.middleware';
import { loginSchema, registerSchema , verifyLoginOtpSchema , resendLoginOtpSchema } from '../auth/auth.schema';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { authRateLimiter } from '../../common/middlewares/rateLimit.middleware';

const router = Router();

router.post("/register" , authRateLimiter , validate(registerSchema) , register);
router.post("/login", authRateLimiter, validate(loginSchema) , login )
router.post("/login/resend/", authRateLimiter, validate(resendLoginOtpSchema), resendLoginCode )
router.post("/login/verify", authRateLimiter, validate(verifyLoginOtpSchema), verifyLogin)
router.get("/profile", authMiddleware , getProfile)

export default router;