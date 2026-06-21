import express from "express";
import userRoutesV1 from "./routes/v1/user.route.js";
import userRoutesV2 from "./routes/v2/user.route.js";
import { config } from "./config/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { gracefulShutdown } from "./config/database.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const PORT = config.port || 3000;

app.use("/auth", authRoutes);

app.use("/api/v1/user", userRoutesV1);
app.use("/api/v2/user", userRoutesV2);

// Must be LAST.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
});

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
