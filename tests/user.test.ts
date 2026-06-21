import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import app from "../src/app.js";
import { pool } from "../src/config/database.js";
import { generateAccessToken } from "../src/utils/jwt.js";

describe("User CRUD Routes Native Integration Tests", () => {
  let server: http.Server;
  let port: number;

  beforeEach(() => {
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

  // Generate test JWT access tokens using our actual helper
  const adminToken = generateAccessToken({
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  });

  const userToken = generateAccessToken({
    id: 101,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
  });

  describe("GET /api/v1/user", () => {
    test("should allow admin role to retrieve user list", async () => {
      const mockUsers = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
        { id: 101, name: "John Doe", email: "john@example.com", role: "user" },
      ];

      mock.method(pool, "query", async (sql: string, _values?: unknown[]) => {
        const querySql = sql.toLowerCase();
        if (querySql.includes("select id, name, email, role from users")) {
          return [mockUsers]; // Return array of users
        }
        return [[]];
      });

      const response = await fetch(`http://localhost:${port}/api/v1/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const body = await response.json();

      assert.strictEqual(response.status, 200);
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.data.length, 2);
      assert.strictEqual(body.data[1].name, "John Doe");
    });

    test("should block user role from retrieving user list (403)", async () => {
      const response = await fetch(`http://localhost:${port}/api/v1/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const body = await response.json();

      assert.strictEqual(response.status, 403);
      assert.strictEqual(body.success, false);
      assert.match(body.message, /Forbidden/);
    });

    test("should block unauthenticated requests (401)", async () => {
      const response = await fetch(`http://localhost:${port}/api/v1/user`, {
        method: "GET",
      });

      const body = await response.json();

      assert.strictEqual(response.status, 401);
      assert.strictEqual(body.success, false);
    });
  });

  describe("GET /api/v1/user/:id", () => {
    test("should successfully return user details and strictly exclude password", async () => {
      const dbMockUser = {
        id: 101,
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        // Note: Even if query logic changes or returns password/refresh token, service layer strips it.
        password: "secretpasswordhashed",
        refresh_token: "some_old_refresh_token",
      };

      mock.method(pool, "query", async (sql: string, _values?: unknown[]) => {
        const querySql = sql.toLowerCase();
        if (querySql.includes("select id, name, email, role")) {
          return [[dbMockUser]];
        }
        return [[]];
      });

      const response = await fetch(`http://localhost:${port}/api/v1/user/101`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const body = await response.json();

      assert.strictEqual(response.status, 200);
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.data.id, 101);
      assert.strictEqual(body.data.name, "John Doe");
      assert.strictEqual(body.data.password, undefined); // EXTREMELY IMPORTANT: Omitted
      assert.strictEqual(body.data.refresh_token, undefined); // Omitted
    });

    test("should return 404 when user does not exist", async () => {
      mock.method(pool, "query", async (_sql: string, _values?: unknown[]) => {
        return [[]]; // not found
      });

      const response = await fetch(`http://localhost:${port}/api/v1/user/999`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const body = await response.json();

      assert.strictEqual(response.status, 404);
      assert.strictEqual(body.success, false);
      assert.match(body.message, /User not found/);
    });
  });
});
