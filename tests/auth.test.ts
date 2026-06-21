import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import bcrypt from "bcrypt";
import app from "../src/app.js";
import { pool } from "../src/config/database.js";

describe("Authentication Routes Native Integration Tests", () => {
  let server: http.Server;
  let port: number;

  beforeEach(() => {
    // Reset any mocks
    mock.reset();

    // Start Express app on a dynamic port
    server = app.listen(0);
    const address = server.address();
    if (address && typeof address !== "string") {
      port = address.port;
    }
  });

  afterEach(() => {
    server.close();
  });

  describe("POST /api/v1/auth/signup", () => {
    test("should successfully register a new user", async () => {
      // Mock pool.query for checking email existence (returns empty list) and insertion (returns insertId)
      mock.method(pool, "query", async (sql: string, _values?: unknown[]) => {
        const querySql = sql.toLowerCase();
        if (querySql.includes("select email from users")) {
          return [[]]; // email does not exist
        }
        if (querySql.includes("insert into users")) {
          return [{ insertId: 101 }]; // successfully created
        }
        return [[]];
      });

      const response = await fetch(
        `http://localhost:${port}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
          }),
        }
      );

      const body = await response.json();

      assert.strictEqual(response.status, 201);
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.message, "User signed up successfully");
      assert.strictEqual(body.data.id, 101);
    });

    test("should reject signup when email is already registered", async () => {
      mock.method(pool, "query", async (sql: string, _values?: unknown[]) => {
        const querySql = sql.toLowerCase();
        if (querySql.includes("select email from users")) {
          return [[{ email: "duplicate@example.com" }]]; // email exists
        }
        return [[]];
      });

      const response = await fetch(
        `http://localhost:${port}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "John Doe",
            email: "duplicate@example.com",
            password: "password123",
          }),
        }
      );

      const body = await response.json();

      assert.strictEqual(response.status, 400);
      assert.strictEqual(body.success, false);
      assert.match(body.message, /already exist/);
    });

    test("should fail zod validation when input shape is invalid", async () => {
      const response = await fetch(
        `http://localhost:${port}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Jo", // min 3 characters required
            email: "not-a-valid-email",
            password: "short", // min 8 characters required
          }),
        }
      );

      const body = await response.json();

      assert.strictEqual(response.status, 400);
      assert.ok(body.errors);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    test("should successfully log in user with correct credentials", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      mock.method(pool, "query", async (sql: string, _values?: unknown[]) => {
        const querySql = sql.toLowerCase();
        if (querySql.includes("select id, name, email, role, password")) {
          return [
            [
              {
                id: 101,
                name: "John Doe",
                email: "john@example.com",
                password: hashedPassword,
                role: "user",
              },
            ],
          ];
        }
        if (querySql.includes("update users set")) {
          return [{ affectedRows: 1 }];
        }
        return [[]];
      });

      const response = await fetch(
        `http://localhost:${port}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "john@example.com",
            password: "password123",
          }),
        }
      );

      const body = await response.json();

      assert.strictEqual(response.status, 200);
      assert.strictEqual(body.success, true);
      assert.ok(body.data.accessToken);
      assert.strictEqual(body.data.user.email, "john@example.com");
      assert.strictEqual(body.data.user.password, undefined); // password omitted

      const cookies = response.headers.get("set-cookie");
      assert.ok(cookies && cookies.includes("refreshToken"));
    });

    test("should fail login when password is incorrect", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      mock.method(pool, "query", async (sql: string, _values?: unknown[]) => {
        const querySql = sql.toLowerCase();
        if (querySql.includes("select id, name, email, role, password")) {
          return [
            [
              {
                id: 101,
                name: "John Doe",
                email: "john@example.com",
                password: hashedPassword,
                role: "user",
              },
            ],
          ];
        }
        return [[]];
      });

      const response = await fetch(
        `http://localhost:${port}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "john@example.com",
            password: "wrongpassword",
          }),
        }
      );

      const body = await response.json();

      assert.strictEqual(response.status, 400);
      assert.strictEqual(body.success, false);
      assert.match(body.message, /Password is incorrect/);
    });
  });
});
