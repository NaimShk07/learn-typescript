import type { Request } from "express";
import type { JwtPayload } from "../types/jwt.js";
import { AppError } from "./AppError.js";
import { HttpStatus } from "../types/http-status.js";

export const getRequestUser = (req: Request): JwtPayload => {
  if (!req.user) {
    throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  return req.user;
};
