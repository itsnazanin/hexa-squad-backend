import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types/AuthRequest";
import { prisma } from "../../config/prisma";
import { AppError } from "../errors/AppErrors";

export const courseAccessMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError("Unauthorized", 401);
        }

        let courseId: number;

        // Direct course access
        if (req.params.courseId) {
            courseId = Number(req.params.courseId);

            if (Number.isNaN(courseId)) {
                return res.status(400).json({
                    message: "Invalid courseId"
                });
            }

        // Section access
        } else if (req.params.sectionId) {
            const sectionId = Number(req.params.sectionId);

            if (Number.isNaN(sectionId)) {
                return res.status(400).json({
                    message: "Invalid sectionId"
                });
            }

            const section = await prisma.section.findUnique({
                where: {
                    id: sectionId
                },
                select: {
                    courseId: true
                }
            });

            if (!section) {
                throw new AppError("Section not found", 404);
            }

            courseId = section.courseId;

        // Lesson access
        } else if (req.params.lessonId) {
            const lessonId = Number(req.params.lessonId);

            if (Number.isNaN(lessonId)) {
                return res.status(400).json({
                    message: "Invalid lessonId"
                });
            }

            const lesson = await prisma.lesson.findUnique({
                where: {
                    id: lessonId
                },
                select: {
                    section: {
                        select: {
                            courseId: true
                        }
                    }
                }
            });

            if (!lesson) {
                throw new AppError("Lesson not found", 404);
            }

            courseId = lesson.section.courseId;

        } else {
            return res.status(400).json({
                message: "Course, section or lesson ID is required"
            });
        }

        // Find the course owner
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                teacher: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        // Course owner always has access
        if (course.teacher.userId === userId) {
            return next();
        }

        // Check whether the user purchased the course
        const purchase = await prisma.purchasedCourse.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (!purchase) {
            throw new AppError(
                "Access denied. You have not purchased this course.",
                403
            );
        }

        next();

    } catch (error) {
        next(error);
    }
};