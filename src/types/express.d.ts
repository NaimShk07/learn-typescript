import type { JwtPayload } from "./jwt.js";

declare global {
  namespace Express {
    interface User {
      id: JwtPayload["id"];
      name: JwtPayload["name"];
      email: JwtPayload["email"];
      role: JwtPayload["role"];
      accessToken?: string;
      refreshToken?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
