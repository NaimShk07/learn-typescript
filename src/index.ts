import app from "./app.js";
import { config } from "./config/index.js";
import { gracefulShutdown, testDbConnection } from "./config/database.js";

const PORT = config.port || 3000;

const startServer = async () => {
  try {
    // Verify database connectivity before starting server
    await testDbConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error(
      "❌ Failed to start the server due to database connection error:"
    );
    console.error(err);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
