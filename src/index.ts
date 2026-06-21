import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";

import { config } from "./config/index.js";
import { gracefulShutdown } from "./config/database.js";
import "./config/passport.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.route.js";
import userRoutesV1 from "./routes/v1/user.route.js";
import userRoutesV2 from "./routes/v2/user.route.js";
import { limiter } from "./middlewares/rate-limit.middleware.js";

const app = express();

const allowedOrigins = new Set<string>(["http://localhost:5173"]);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin is not allowed"));
  },
  credentials: true,
};

// Security
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Authentication
app.use(passport.initialize());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutesV1);
app.use("/api/v2/user", userRoutesV2);

// Error handler
app.use(errorHandler);

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

// Graceful shutdown
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
