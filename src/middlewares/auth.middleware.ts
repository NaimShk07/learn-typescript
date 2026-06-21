import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { HttpStatus } from "../types/http-status.js";
import { getRequestUser } from "../utils/request-user.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token = req.cookies.refreshToken;
  let token: string | undefined = req.headers.authorization;
  if (!token) {
    throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  token = token.split(" ")[1];

  const verifiedToken = verifyAccessToken(token);

  req.user = verifiedToken;
  next();
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getRequestUser(req);

    if (!roles.includes(user.role)) {
      throw new AppError(HttpStatus.FORBIDDEN, "Forbidden");
    }

    next();
  };
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(HttpStatus.OK).json({
    success: true,
    message: "User logged out successfully",
  });
};
