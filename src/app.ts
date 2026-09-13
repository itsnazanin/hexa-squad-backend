import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import orderRoutes from "./modules/order/order.routes";
import { generalRateLimiter } from "./common/middlewares/rateLimit.middleware";
import courseRoutes from "./modules/courses/courses.routes"
import sectionRoutes from "./modules/courses/sections.routes"
import lessonRoutes from "./modules/courses/lessons.routes"
import blogRoutes from "./modules/blogs/blogs.routes"
import ordersRoutes from "./modules/order/order.routes"
import teacherRoutes from "./modules/teacher/teacher.routes"
import { requestLogger } from "./common/middlewares/requestLogger.middleware";
import { errorMiddleware } from "./common/middlewares/error.middleware";


const app = express();

app.use(requestLogger)

app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(helmet());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/orders", generalRateLimiter, orderRoutes)
app.use("/courses" , generalRateLimiter , courseRoutes)
app.use("/sections", generalRateLimiter , sectionRoutes)
app.use("/lessons" , generalRateLimiter , lessonRoutes)
app.use("/blogs", generalRateLimiter , blogRoutes)
app.use("/orders" , generalRateLimiter , ordersRoutes)
app.use("/teacher", generalRateLimiter , teacherRoutes)
app.use(errorMiddleware)

app.get("/" , (req, res) => {
    res.json({
        message: "Counter Platform API is running"
    })
})

export default app;