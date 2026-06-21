import { Request, Response, Router } from "express";
import passport from "passport";
import { AppError } from "../utils/AppError.js";
import { HttpStatus } from "../types/http-status.js";

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

// 👉  <-- These two are **not** under "/user"
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

    // For a SPA you could redirect with the tokens in the querystring,
    // or set them as HttpOnly cookies (recommended):
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
