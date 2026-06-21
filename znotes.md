# Backend Notes — Node.js + TypeScript + MySQL + Auth

## Project Snapshot

This backend now goes beyond basic CRUD. It includes:

- layered architecture
- MySQL with repository pattern
- JWT authentication
- refresh token flow
- Google OAuth with Passport
- role-based authorization
- Zod validation
- Helmet
- CORS
- rate limiting
- centralized error handling

---

## Current Architecture

```text
Request
→ Route
→ Middleware
→ Controller
→ Service
→ Repository
→ MySQL
→ Response
```

### Layer Responsibility

- `routes/` connect endpoints to middleware and controllers
- `controllers/` handle request and response
- `services/` contain business logic
- `repositories/` contain SQL queries
- `middlewares/` handle auth, validation, rate limiting, and errors
- `utils/` contain reusable helpers
- `types/` contain shared TypeScript types
- `schemas/` contain Zod validation schemas

---

## Core Features Added

### 1. JWT Authentication

The project uses:

- access token for protected APIs
- refresh token for issuing a new access token

Flow:

1. user logs in
2. server returns access token in response body
3. server stores refresh token in `httpOnly` cookie
4. client sends access token in `Authorization` header
5. refresh route issues new tokens

### 2. Google OAuth

Passport with Google strategy is configured.

Flow:

1. client hits Google auth route
2. Google verifies user
3. server finds or creates local user
4. server creates JWT tokens
5. refresh token is stored in cookie
6. access token is returned to client

### 3. RBAC

The project has role-based route protection.

- `authenticate` verifies the access token
- `authorize(...roles)` checks if the logged-in user has the required role

Example:

- admin-only routes
- protected user routes

### 4. Request Validation with Zod

Signup now uses schema validation.

Benefits:

- prevents bad input early
- keeps controllers cleaner
- ensures parsed request body shape

### 5. Security Middleware

#### Helmet

Adds secure HTTP headers.

#### CORS

Configured with typed allowed origins and `credentials: true`.

#### Rate Limiting

- global limiter for all requests
- login limiter for brute-force protection

---

## Important Files and Why They Matter

### `src/index.ts`

Main app setup:

- Helmet
- CORS
- rate limiter
- JSON parsing
- cookie parser
- Passport init
- route registration
- error handler

### `src/middlewares/auth.middleware.ts`

Handles:

- access token verification
- route authorization

### `src/config/passport.ts`

Contains Google OAuth strategy setup.

### `src/middlewares/validate.middleware.ts`

Validates `req.body` using Zod schema.

### `src/utils/request-user.ts`

Safely narrows `req.user` so TypeScript understands authenticated user access.

### `src/types/express.d.ts`

Extends Express request/user typing for custom auth data.

---

## TypeScript Lessons From This Project

### 1. Declaration Merging

Used to extend Express `Request` and `User`.

Why useful:

- lets us add `req.user`
- avoids using `any`

### 2. Type Narrowing

`getRequestUser(req)` helps make TypeScript understand that `req.user` exists after auth.

### 3. DTOs

Used for request/service data shapes:

- `CreateUserDto`
- `UpdateUserDto`
- `LoginUserDto`

### 4. Shared Types

Used for:

- JWT payload
- user model
- API response shape

---

## Middleware Order Matters

Current order in the app:

1. Helmet
2. CORS
3. rate limiting
4. body parsers
5. cookie parser
6. Passport initialize
7. routes
8. error handler

Why important:

- security applies before routes
- body is available before controllers
- errors are caught last

---

## Authentication Notes

### Access Token

- short-lived
- used for protected routes
- passed in `Authorization` header

### Refresh Token

- stored in cookie
- used only to get new access token
- helps keep login session alive

### Cookie Settings

- `httpOnly`
- `sameSite: "strict"`
- `secure` in production

---

## Versioned Routes

The project now has:

- `api/v1`
- `api/v2`

`v2` is currently a placeholder, but this is useful for future API evolution.

---

## Tools Used

- ESLint
- Prettier
- Husky
- TypeScript strict mode
- mysql2 promise API
- Passport Google OAuth
- Zod
- express-rate-limit

---

## What This Project Teaches Well

- how to structure a backend
- how auth flows are layered
- how middleware composes in Express
- how TypeScript helps with request/user typing
- how validation improves API safety
- how to add OAuth to an existing JWT backend

---

## Improvement Areas To Remember

- align `.env.example` with current JWT secret names
- expand Zod validation to more routes
- improve repository return typing
- make v2 routes meaningful when new features are added
- Understood service-repository pattern
- Implemented error handling system
- Used environment variables properly
- Enforced code quality tools

---

# 🚀 Mental Model

Client → Route → Controller → Service → Repository → MySQL → Response

---

# 🎯 Interview Points

### Why MVC?

To separate concerns and improve scalability.

### Why Repository layer?

To isolate DB logic from business logic.

### Why asyncHandler?

To avoid repetitive try/catch blocks.

### Why env variables?

To keep config secure and flexible.

### Why ESLint + Prettier?

To maintain consistent and bug-free code.

---

# 📌 End of Week 1

You now have a production-style backend foundation using:

- Node.js
- TypeScript
- Express
- MySQL

Next step: JWT Authentication + Validation (Week 2)
