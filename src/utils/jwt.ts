import { config } from "../config/index.js";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.js";

const ACCESS_TOKEN_SECRET = config.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = config.REFRESH_TOKEN_SECRET as string;



export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};
