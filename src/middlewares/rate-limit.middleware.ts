import rateLimit from "express-rate-limit";
import { HttpStatus } from "../types/http-status.js";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // relaxed from 15 to 100
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      message: "Too many requests, please try again after 15 minutes",
    });
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // relaxed from 3 to 5
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      message: "Too many login attempts, please try again after 15 minutes",
    });
  },
});
