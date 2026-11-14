# Technical specification: Reach for the Stars API

Version 1.0.0, SE1 final build. Developer: Kendra Shanice Tan (kendratan-dev), BSCS 3-1. Group: BSCS 3-1.

## 1. Purpose and scope

Reach for the Stars is an interactive trivia and question-set game platform where hosts create and manage question sets, players join game sessions, answer timed questions, and compete on leaderboards. The Library Game Hub reads completed game results. SE1 covers the fully tested backend API, database schema, authentication, gameplay logic, and OpenAPI documentation. SE2 will build the frontend client interface.

## 2. Architecture

![Architecture](diagrams/architecture.png)

A request enters the Express application, passes through security middleware (Helmet, CORS, rate-limiting), JSON body parsing, route matching, request validation middleware, controller handlers, business logic services, Sequelize repository data access, and PostgreSQL persistence.

| Layer | Folder | Responsibility | Never |
|---|---|---|---|
| Routes | src/routes | Define URL endpoints and map to controllers | Directly access database or contain business logic |
| Validators | src/validators | Validate request body, query parameters, and headers | Perform database queries or business operations |
| Controllers | src/controllers | Handle HTTP requests, call services, return responses | Contain direct SQL queries or validation rules |
| Services | src/services | Implement core game rules, authentication, and logic | Interact directly with Express req/res objects |
| Repositories | src/repositories | Execute database queries via Sequelize ORM | Handle HTTP status codes or request formatting |
| Models | src/models | Define Sequelize database schemas and associations | Execute HTTP request/response handling |

## 3. Data

The database consists of 10 normalized tables managed via Sequelize migrations and seeders. See [Data Dictionary](data-dictionary.md).

![ERD](diagrams/erd.png)

Database constraints include primary keys, foreign key relations with cascade/restrict rules, UNIQUE constraints (such as uq_session_user_seat ensuring one seat per account per game on session players), and check constraints mapped in constraint-map.js.

## 4. Security

| Concern | Decision |
|---|---|
| Passwords | Hashed securely using bcrypt with salt rounds before database persistence. |
| Login and tokens | Stateless JWT authentication issued upon login, verified via bearer token middleware. |
| Roles | Role-based access control (PLAYER vs ADMIN) enforced on sensitive endpoints. |
| Input | Strict Joi/Express validation on all incoming request payloads. |
| Your game's trust boundary | Server validates all game progression, answer correctness, and scoring instead of trusting the client. |
| Browsers (CORS) | Restricted to origins specified in CORS_ORIGINS environment variable. |
| The Hub | Authenticated via X-Hub-Key header for retrieving finished game results. |

## 5. Quality

The test suite includes 33 comprehensive unit and HTTP tests built with Jest and Supertest, achieving 69.48% code coverage. The Postman collection contains 77 requests with 100% passing test assertions. Automated checks verify 54 rigorous criteria.

## 6. Deployment

Hosted on Render web service and managed PostgreSQL 18 database in Singapore. Uses 
pm run start:render to run migrations and start the server. Subject to Render free tier spin-down limits.

## 7. Decisions and their reasons

| Decision | Reason | Alternative not taken |
|---|---|---|
| Use Sequelize ORM | Provides robust schema migration, validation, and relational modeling for PostgreSQL. | Raw SQL queries (leads to maintenance overhead). |
| JWT Authentication | Stateless verification simplifies scaling across cloud instances. | Server-side sessions (requires redis/sticky sessions). |
| Explicit Health Check Route | Ensures Render pings /api/v1/health and receives immediate 200 OK responses. | Root / endpoint check. |
