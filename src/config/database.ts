import mysql from "mysql2/promise";
import { config } from "./index.js";

export const pool = mysql.createPool({
  host: config.db.host,
  port: Number(config.db.port),
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,

  waitForConnections: true,
  connectionLimit: 10,
});

export const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await pool.end();
  process.exit(0);
};
