import express from "express";
import userRoutes from "./routes/user.route.js";
import { config } from "./config/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { gracefulShutdown } from "./config/database.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/auth.route.js";
import "./config/passport.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const PORT = config.port || 3000;

app.use("/auth", authRoutes);

app.use("/user", userRoutes);

// Must be LAST.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
});

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
