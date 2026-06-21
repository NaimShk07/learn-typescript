import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { HttpStatus } from "../types/http-status.js";
import { getRequestUser } from "../utils/request-user.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(
      HttpStatus.UNAUTHORIZED,
      "Unauthorized: Missing or invalid token format"
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError(
      HttpStatus.UNAUTHORIZED,
      "Unauthorized: Token is missing"
    );
  }

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
