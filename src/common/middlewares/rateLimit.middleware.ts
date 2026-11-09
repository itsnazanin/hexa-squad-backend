
import rateLimit from "express-rate-limit";

const isRateLimitEnabled =
  process.env.ENABLE_RATE_LIMIT === "true";

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
  skip: () => !isRateLimitEnabled,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many authentication attempts. Please try again later.",
  },
  skip: () => !isRateLimitEnabled,
});
