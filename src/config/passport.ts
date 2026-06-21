import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import {
  findByEmail,
  update,
  create,
} from "../repositories/user.repository.js";

interface GoogleAuthUser extends Express.User {
  accessToken: string;
  refreshToken: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Google may return multiple emails – we pick the first verified one
        const email = profile.emails?.[0]?.value;
        if (!email) throw new Error("No email returned from Google");

        // Find existing user or create a new one
        let user = await findByEmail(email);
        if (!user) {
          const created = await create({
            name: profile.displayName,
            email,
            password: "", // not used for OAuth users
            // role: "user",
          });
          user = {
            id: created,
            name: profile.displayName,
            email,
            password: "",
            role: "user",
          };
        }

        // Issue JWTs (reuse your existing helpers)
        const payload = {
          id: user.id,
          name: user.name,
          email,
          role: user.role,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Store refresh token
        await update(user.id, { refreshToken });

        const googleAuthUser: GoogleAuthUser = {
          ...payload,
          accessToken,
          refreshToken,
        };

        return done(null, googleAuthUser);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);
