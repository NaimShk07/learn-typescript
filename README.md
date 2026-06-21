# TypeScript Node.js Authentication API

A backend API built with Node.js, Express, TypeScript, and MySQL using a layered architecture.

This project includes:

- JWT authentication with access token + refresh token flow
- Google OAuth login with Passport
- RBAC-style authorization middleware
- Zod request validation
- Rate limiting with `express-rate-limit`
- Security middleware with Helmet
- CORS configuration for frontend integration
- MySQL repository pattern

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MySQL
- `mysql2`
- JWT
- Passport Google OAuth 2.0
- Zod
- ESLint
- Prettier
- Husky

## Project Structure

```text
src/
├── config/         # env, database, passport strategy
├── controllers/    # request/response handling
├── middlewares/    # auth, validation, error, rate limit
├── repositories/   # MySQL queries
├── routes/         # API routes
├── schemas/        # Zod schemas
├── services/       # business logic
├── types/          # shared TypeScript types
└── utils/          # helpers like JWT, bcrypt, AppError
```

## Architecture

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

## Features

### 1. Authentication

- User signup
- User login
- Refresh token rotation
- Logout
- Access token verification using `Authorization: Bearer <token>`
- Refresh token stored in cookie

### 2. Google OAuth

- `passport-google-oauth20` strategy
- Google callback issues app JWT tokens
- Refresh token is stored as cookie

### 3. Authorization

- `authenticate` middleware verifies access token
- `authorize(...roles)` middleware protects role-based routes

### 4. Validation

- Zod-based request validation
- Signup request currently validates:
  - `name`
  - `email`
  - `password`

### 5. Security

- Helmet for secure HTTP headers
- CORS with allowed-origin configuration
- Global rate limiter
- Dedicated login rate limiter

## API Routes

### Auth

| Method | Route                          | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/api/v1/auth/google`          | Start Google OAuth login |
| GET    | `/api/v1/auth/google/callback` | Google OAuth callback    |

### User V1

| Method | Route                  | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/v1/user/signup`  | Register a new user          |
| POST   | `/api/v1/user/login`   | Login user                   |
| POST   | `/api/v1/user/refresh` | Issue new access token       |
| POST   | `/api/v1/user/logout`  | Logout user                  |
| GET    | `/api/v1/user`         | Get all users, admin only    |
| POST   | `/api/v1/user`         | Create user, protected route |
| GET    | `/api/v1/user/:id`     | Get user by id               |
| PUT    | `/api/v1/user/:id`     | Update user                  |
| DELETE | `/api/v1/user/:id`     | Delete user, admin only      |

### User V2

`/api/v2/user` route file exists as a placeholder for versioned expansion.

## Authentication Flow

### Email/Password Flow

1. User signs up with validated input.
2. Password is hashed using bcrypt.
3. User logs in.
4. Server returns:
   - access token in response body
   - refresh token in `httpOnly` cookie
5. Protected routes use the access token in the `Authorization` header.
6. Refresh endpoint issues a new access token and refresh token.

### Google OAuth Flow

1. Client hits `/api/v1/auth/google`
2. Google authenticates the user
3. Callback creates or finds the user
4. App generates JWT tokens
5. Refresh token is set in cookie
6. Access token is returned in the response

## Environment Variables

Create a `.env` file in the root:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

PORT=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

Note: `.env.example` still needs to be aligned with the newer JWT variable names if you want it to match the current code exactly.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
```

## Local Setup

```bash
npm install
npm run dev
```

## Important Middleware

- `helmet()` for security headers
- `cors()` with typed allowed origins
- `cookieParser()` for refresh token cookies
- `passport.initialize()` for Google OAuth
- `limiter` for global request limiting
- `loginLimiter` for login attempts
- `validate()` for request body validation
- `errorHandler` for centralized error responses

## Learning Focus In This Project

This project is a good example of learning:

- Express + TypeScript backend structure
- Layered architecture
- JWT auth flow
- OAuth basics
- middleware design
- request validation
- role-based authorization
- security-focused backend setup

## Current Notes

A few things in the codebase are still learning-stage and can be improved further, such as deeper type safety in repository return types and expanding validation across more endpoints.
