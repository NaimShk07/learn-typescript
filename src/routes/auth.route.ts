import { Request, Response, Router } from "express";
import passport from "passport";
import { AppError } from "../utils/AppError.js";
import { HttpStatus } from "../types/http-status.js";
import {
  loginUser,
  signUser,
  refreshToken,
  logout,
} from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/rate-limit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema.js";

const router = Router();

const getOAuthTokens = (req: Request) => {
  const { user } = req;

  if (!user?.accessToken || !user.refreshToken) {
    throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  return {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };
};

// Local Auth Routes
router.post("/signup", validate(createUserSchema), asyncHandler(signUser));
router.post(
  "/login",
  loginLimiter,
  validate(loginUserSchema),
  asyncHandler(loginUser)
);
router.post("/refresh", asyncHandler(refreshToken));
router.post("/logout", authenticate, asyncHandler(logout));

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req: Request, res: Response) => {
    const { accessToken, refreshToken } = getOAuthTokens(req);

    // For a SPA we store refresh token in cookie and send access token
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ accessToken });
  }
);

export default router;
