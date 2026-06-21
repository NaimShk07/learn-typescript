# Backend Interview Questions & Answers (Week 1 + Week 2)

## Week 1 — TypeScript Basics + Code Structure

---

### 1. What is TypeScript?

**Answer:**
TypeScript is a superset of JavaScript that adds static typing, interfaces, generics, and compile-time error checking.

**Benefits:**

- Better code quality
- Early error detection
- Improved IDE support
- Easier refactoring

---

### 2. Difference between `type` and `interface`?

**Answer:**

**Interface**

- Mainly used for object shapes
- Supports declaration merging
- Can be extended

```ts
interface User {
  id: number;
  name: string;
}
```

**Type**

- More flexible
- Can represent unions, intersections, primitives

```ts
type Status = "active" | "inactive";
```

---

### 3. What are Generics?

**Answer:**

Generics allow reusable code while preserving type safety.

```ts
function getData<T>(data: T): T {
  return data;
}
```

Example:

```ts
getData<string>("Hello");
getData<number>(10);
```

---

### 4. What are Utility Types in TypeScript?

**Answer:**

Built-in types that transform existing types.

Examples:

```ts
Partial<User>;
Required<User>;
Pick<User, "id">;
Omit<User, "password">;
```

---

### 5. What is MVC Architecture?

**Answer:**

MVC separates application concerns.

```text
Client
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

**Controller**

- Handles requests and responses

**Service**

- Contains business logic

**Repository**

- Handles database queries

---

### 6. Why use Service Layer?

**Answer:**

The service layer separates business logic from controllers.

Benefits:

- Reusable logic
- Easier testing
- Cleaner controllers

---

### 7. Why use Repository Layer?

**Answer:**

Repository layer isolates database operations.

Benefits:

- Database abstraction
- Easier maintenance
- Better code organization

---

### 8. Explain your project architecture.

**Answer:**

```text
Request
→ Route
→ Controller
→ Service
→ Repository
→ MySQL
→ Response
```

Controllers handle HTTP concerns, services handle business logic, repositories handle database access.

---

### 9. What is Environment Configuration?

**Answer:**

Environment variables store sensitive or environment-specific values.

Examples:

```env
PORT=3000
DB_HOST=localhost
JWT_SECRET=secret
```

Access:

```ts
process.env.JWT_SECRET;
```

---

### 10. Why should secrets not be hardcoded?

**Answer:**

Hardcoding secrets:

- Exposes credentials
- Makes deployments difficult
- Creates security risks

Environment variables solve this problem.

---

### 11. What is Centralized Error Handling?

**Answer:**

A single middleware handles all application errors.

Benefits:

- Consistent error responses
- Cleaner controllers
- Easier maintenance

Example:

```ts
next(new AppError("User not found", 404));
```

---

### 12. What is Custom Error Handling?

**Answer:**

Custom errors provide additional information.

```ts
new AppError("Unauthorized", 401);
```

Allows better error management throughout the application.

---

### 13. Why use asyncHandler?

**Answer:**

Avoids repetitive try-catch blocks.

```ts
const getUsers = asyncHandler(async (req, res) => {
  ...
});
```

Automatically forwards errors to middleware.

---

### 14. What is ESLint?

**Answer:**

ESLint analyzes code and identifies:

- Bugs
- Bad practices
- Style violations

Improves code quality.

---

### 15. What is Prettier?

**Answer:**

Prettier automatically formats code according to predefined rules.

Benefits:

- Consistent formatting
- Better readability
- Less code review noise

---

### 16. What is Husky?

**Answer:**

Husky runs Git hooks automatically.

Example:

```bash
git commit
```

Before commit:

```bash
npm run lint
npm run format
```

---

### 17. Why use MySQL Connection Pooling?

**Answer:**

Connection pooling reuses database connections.

Benefits:

- Better performance
- Reduced overhead
- Improved scalability

---

### 18. What is the difference between SQL and NoSQL?

**Answer:**

**SQL**

- Structured schema

---

## New Questions From Current Project

### 19. What is the difference between access token and refresh token?

**Answer:**

An access token is used to access protected APIs and is usually short-lived.

A refresh token is used to generate a new access token and is usually longer-lived.

In this project:

- access token is sent in the `Authorization` header
- refresh token is stored in an `httpOnly` cookie

---

### 20. Why store refresh token in an `httpOnly` cookie?

**Answer:**

Because JavaScript cannot read `httpOnly` cookies, which reduces the risk of token theft through XSS.

Benefits:

- safer than storing long-lived token in localStorage
- works well with refresh-token flow

---

### 21. What is RBAC?

**Answer:**

RBAC stands for Role-Based Access Control.

It restricts routes or actions based on user roles such as:

- admin
- user

In this project, the `authorize(...roles)` middleware checks whether the authenticated user has permission.

---

### 22. What is Passport.js?

**Answer:**

Passport is an authentication middleware for Node.js.

It provides strategies for different login methods like:

- Google OAuth
- local auth
- GitHub auth

In this project, Passport is used for Google OAuth login.

---

### 23. How does Google OAuth work in your project?

**Answer:**

Flow:

1. client hits Google login route
2. Passport redirects to Google
3. user authenticates with Google
4. callback receives Google profile
5. backend finds or creates local user
6. backend generates app JWT tokens
7. refresh token is stored in cookie
8. access token is returned to client

---

### 24. What is Zod and why use it?

**Answer:**

Zod is a TypeScript-first schema validation library.

It is used to validate request data at runtime.

Benefits:

- catches invalid input early
- keeps controllers clean
- works nicely with TypeScript

Example uses:

- validating signup request body

---

### 25. Why is runtime validation still needed if you use TypeScript?

**Answer:**

TypeScript only checks code during development.
It does not validate actual HTTP input at runtime.

So if a client sends invalid JSON, wrong types, or missing fields, TypeScript alone cannot stop that.

That is why runtime validators like Zod are important.

---

### 26. What is CORS?

**Answer:**

CORS stands for Cross-Origin Resource Sharing.

It controls which frontend origins are allowed to call your backend.

In this project:

- only allowed origins are accepted
- credentials are enabled because refresh tokens are stored in cookies

---

### 27. Why use `credentials: true` in CORS?

**Answer:**

It allows cookies and other credentials to be sent in cross-origin requests.

This is needed when the frontend must send the refresh-token cookie to the backend.

---

### 28. What is Helmet?

**Answer:**

Helmet is an Express middleware that sets secure HTTP headers.

Benefits:

- improves default app security
- helps reduce common web vulnerabilities

---

### 29. Why use rate limiting?

**Answer:**

Rate limiting restricts how many requests a client can make in a time window.

Benefits:

- reduces brute-force login attempts
- protects server resources
- improves API security

This project uses:

- global rate limiter
- login-specific rate limiter

---

### 30. What is Express declaration merging?

**Answer:**

Declaration merging allows us to extend existing Express types.

Example use in this project:

- adding custom `user` data to `req.user`

This helps avoid `any` and makes auth middleware type-safe.

---

### 31. Why create a helper like `getRequestUser(req)`?

**Answer:**

Because TypeScript does not automatically know that middleware already authenticated the request.

A helper function narrows the type and ensures:

- `req.user` exists
- the returned shape matches the JWT payload

This makes controller code cleaner and safer.

---

### 32. Why separate controller, service, and repository?

**Answer:**

This separation keeps the code organized.

- controller handles HTTP
- service handles business logic
- repository handles SQL

Benefits:

- easier maintenance
- easier debugging
- cleaner architecture

---

### 33. Why add API versioning?

**Answer:**

API versioning helps evolve an API without breaking older clients.

For example:

- `/api/v1/...`
- `/api/v2/...`

This project already has route versioning prepared.

---

### 34. What is the repository pattern?

**Answer:**

The repository pattern isolates database logic from service logic.

Benefits:

- cleaner code
- better separation of concerns
- easier future migration if DB logic changes

---

### 35. What are some security practices used in your project?

**Answer:**

This project uses:

- password hashing with bcrypt
- JWT access token flow
- refresh token cookie
- Helmet
- rate limiting
- CORS restrictions
- role-based authorization
- centralized error handling
- Relational
- Examples: MySQL, PostgreSQL

**NoSQL**

- Flexible schema
- Document-based
- Examples: MongoDB

---

# Week 2 — Authentication Deep Dive

---

### 19. What is Authentication?

**Answer:**

Authentication verifies who a user is.

Example:

```text
Email + Password
```

Result:

```text
Identity verified
```

---

### 20. What is Authorization?

**Answer:**

Authorization determines what a user can access.

Example:

```text
User → View Profile

Admin → Delete Users
```

---

### 21. Difference between Authentication and Authorization?

**Answer:**

Authentication:

```text
Who are you?
```

Authorization:

```text
What are you allowed to do?
```

---

### 22. What is JWT?

**Answer:**

JWT (JSON Web Token) is a stateless authentication mechanism.

Used to securely transmit user information between client and server.

---

### 23. Structure of JWT?

**Answer:**

```text
Header.Payload.Signature
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

---

### 24. What is stored inside JWT Payload?

**Answer:**

Typically:

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "admin"
}
```

Never store:

- Passwords
- Secrets
- Sensitive information

---

### 25. Why is JWT called Stateless?

**Answer:**

The server does not store session data.

All required information exists inside the token and is verified using a secret key.

---

### 26. How does JWT Verification work?

**Answer:**

Server verifies:

```ts
jwt.verify(token, JWT_SECRET);
```

If signature matches:

```text
Valid token
```

Otherwise:

```text
401 Unauthorized
```

---

### 27. What is an Access Token?

**Answer:**

A short-lived JWT used for API authentication.

Example:

```text
15 minutes
```

Sent in:

```http
Authorization: Bearer <token>
```

---

### 28. What is a Refresh Token?

**Answer:**

A long-lived token used to generate new access tokens.

Example:

```text
7 days
```

Used when access token expires.

---

### 29. Why use Access + Refresh Tokens?

**Answer:**

Benefits:

- Better security
- Short-lived access tokens
- Seamless user experience

---

### 30. What is Refresh Token Rotation?

**Answer:**

Every refresh request generates:

- New access token
- New refresh token

Old refresh token becomes invalid.

Improves security.

---

### 31. Why store Refresh Tokens in Database?

**Answer:**

Allows:

- Logout
- Token revocation
- Rotation validation
- Session management

---

### 32. Why use HttpOnly Cookies?

**Answer:**

JavaScript cannot access HttpOnly cookies.

Protects against XSS attacks.

---

### 33. What is bcrypt?

**Answer:**

bcrypt is a password hashing library.

Used to securely store passwords.

---

### 34. Why not store plaintext passwords?

**Answer:**

If database leaks:

```text
All user passwords exposed
```

Hashing prevents this.

---

### 35. Difference between Hashing and Encryption?

**Answer:**

**Hashing**

- One-way
- Cannot be reversed

**Encryption**

- Two-way
- Can be decrypted

Passwords should be hashed, not encrypted.

---

### 36. What is Salting?

**Answer:**

Salt is random data added before hashing.

Benefits:

- Prevents rainbow table attacks
- Makes hashes unique

---

### 37. What is OAuth2?

**Answer:**

OAuth2 allows users to log in using third-party providers.

Example:

```text
Login with Google
```

---

### 38. Explain OAuth2 Flow.

**Answer:**

```text
User
 ↓
Google Login
 ↓
User Consent
 ↓
Authorization Code
 ↓
Access Token
 ↓
User Information
```

---

### 39. What is RBAC?

**Answer:**

RBAC stands for Role-Based Access Control.

Access is granted based on user roles.

Examples:

```text
user
admin
moderator
```

---

### 40. How would you implement RBAC?

**Answer:**

Store role:

```text
admin
user
```

Create middleware:

```ts
authorize("admin");
```

Allow only specific roles to access routes.

---

### 41. What is Middleware?

**Answer:**

Middleware executes before request reaches the controller.

Uses:

- Authentication
- Authorization
- Logging
- Validation

---

### 42. How does Auth Middleware work?

**Answer:**

Flow:

```text
Request
 ↓
Read Bearer Token
 ↓
Verify JWT
 ↓
Attach User to Request
 ↓
next()
```

---

### 43. Explain your Authentication System.

**Answer:**

```text
Login
 ↓
Validate Password
 ↓
Generate Access Token
 ↓
Generate Refresh Token
 ↓
Store Refresh Token in DB
 ↓
Return Access Token
 ↓
Set Refresh Token Cookie
```

Refresh Flow:

```text
Refresh Cookie
 ↓
Verify Token
 ↓
Compare With DB
 ↓
Rotate Tokens
 ↓
Return New Access Token
```

---

### 44. What security practices did you implement?

**Answer:**

- Password hashing with bcrypt
- JWT authentication
- Refresh token rotation
- HttpOnly cookies
- Separate access and refresh secrets
- Centralized error handling
- Type-safe TypeScript code

---

### 45. Explain your backend project in one minute.

**Answer:**

I built a User Management API using Node.js, Express, TypeScript, and MySQL following a layered architecture (Routes → Controllers → Services → Repositories). I implemented CRUD operations, centralized error handling, JWT authentication with access and refresh tokens, refresh token rotation, bcrypt password hashing, HttpOnly cookies, environment-based configuration, and code quality tooling using ESLint, Prettier, and Husky. The project follows scalable backend design principles and strong TypeScript typing throughout.
