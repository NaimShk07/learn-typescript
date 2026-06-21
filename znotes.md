# 📘 Week 1 Notes — Node.js + TypeScript + MySQL Backend

## 📌 Overview

This week focused on building a scalable backend API using Node.js, TypeScript, Express, and MySQL with proper architecture and tooling.

We learned how real backend systems are structured using:

- MVC + Service + Repository pattern
- MySQL integration
- Environment configuration
- Centralized error handling
- Code quality tools (ESLint, Prettier, Husky)

---

# 🏗️ Project Architecture

## 📁 Folder Structure

src/
│
├── config/ → Environment + DB setup
├── controllers/ → Request/Response handling
├── services/ → Business logic
├── repositories/ → Database queries (MySQL)
├── routes/ → API endpoints
├── middlewares/ → Error handling
├── utils/ → Helpers (AppError, asyncHandler)
├── types/ → TypeScript interfaces
├── app.ts → Express app setup
└── server.ts → Server entry point

---

# 🔄 Request Flow

Client Request
↓
Route
↓
Controller
↓
Service
↓
Repository
↓
MySQL Database

---

# ⚙️ Tech Stack Used

## Node.js

- Runtime for executing JavaScript on server
- Handles API requests

## Express.js

- Web framework for routing & middleware
- Simplifies API creation

## TypeScript

- Adds static typing
- Prevents runtime errors
- Improves maintainability

## MySQL

- Relational database for structured data

## mysql2

- MySQL driver for Node.js
- Supports promises

---

# 🧠 Core Concepts Learned

---

## MVC + Layered Architecture

### Why?

To separate responsibilities and make code scalable.

### Layers:

- Controller → HTTP logic
- Service → Business logic
- Repository → Database logic

### Benefit:

- Clean code
- Easy maintenance
- Scalable apps

---

## Repository Pattern

### Why?

To isolate database queries from business logic.

### Example:

SELECT \* FROM users

### Benefit:

- Easy DB replacement
- Cleaner service layer

---

## Environment Variables (.env)

### Why?

To avoid hardcoding sensitive config.

### Example:

PORT=5000
DB_HOST=localhost

### Usage:

process.env.PORT

---

## MySQL Connection Pool

### Why?

- Reuses DB connections
- Improves performance

---

## Centralized Error Handling

### Why?

Avoid try/catch in every controller.

### Custom Error:

class AppError extends Error

### Global Middleware:

app.use(errorHandler)

---

## Async Error Handling

### Why?

Express does not handle async errors automatically.

### Solution:

asyncHandler wrapper

---

## API Response Format

### Success:

{
"success": true,
"data": {}
}

### Error:

{
"success": false,
"message": "Error message"
}

---

## TypeScript Interfaces

### Why?

- Strong typing
- Better safety
- Better IDE support

---

## ESLint

### Why?

- Finds bugs
- Enforces rules
- Improves code quality

---

## Prettier

### Why?

- Auto formats code
- Keeps consistency

---

## Husky + Lint-Staged

### Why?

Runs checks before commit.

Flow:
git commit → lint → format → commit

---

# 🧪 API Endpoints

| Method | Endpoint   | Description    |
| ------ | ---------- | -------------- |
| GET    | /users     | Get all users  |
| GET    | /users/:id | Get user by id |
| POST   | /users     | Create user    |
| PUT    | /users/:id | Update user    |
| DELETE | /users/:id | Delete user    |

---

# 🗄️ Database Schema

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(255) UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

# 🔐 Key Takeaways

- Built full REST API with MySQL
- Learned MVC architecture
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
