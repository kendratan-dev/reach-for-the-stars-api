# Development journey: [Reach for the Stars] API

Student: [Kendra Shanice R. Tan] · Section: [3-1] · Group: [5]

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: Nov 12–13, 2026 · Time spent: 3 hours
- Goal: Implement full JWT-based user authentication, bcrypt password hashing, role-based admin account management, and an automated 43-request Postman test suite.
- What I built: Created the `add-password-to-users` migration and `demo-passwords` seeder (`db/seeders/20261112130223-demo-passwords.js`), implemented `POST /auth/register`, `POST /auth/login`, and `GET /auth/me` with `toJson(user)` hash stripping, added admin user management routes (`GET /users` and `PATCH /users/:id/role`), replaced `X-Demo-User` headers with Bearer JWT verification in `requireUser`, updated `.env.example`, and built a 43-request Postman collection (`postman/Reach_for_the_Stars_API.postman_collection.json`) covering login, registration, token errors, and role promotion.
- Evidence: PR (feature/auth -> main) · Commits: `668b048`, `7b9df42`, `79b5562`, `3f84cad` , `17c4247` · `npm run check` passing all H and I fresh-database checks (43 requests, 43 tests, 0 failed).
- Problem I hit: Hit a `password_hash` column conflict during migration, and later ran into `409 DUPLICATE_SCHOOL_ID` / fresh-database test mismatches in Postman when static test IDs either collided across repeated runs or didn't exist on a newly reset database.
- How I solved it: Reset the database cleanly to resync migration history, used `{{$randomInt}}` for new user registration tests so repeated runs never collide, and pointed the duplicate-ID `409` test at seeded account `2026-0001` so it passes reliably after `npm run db:reset`.
- Decision I made and why: Used a 64-character cryptographically secure random string for `JWT_SECRET` and verified login passwords against a dummy hash when a `school_id` is unknown so both invalid-password and unknown-ID `401` responses behave identically and resist timing/enumeration attacks.
- Changes to my design set: Added the `password_hash` column to the `users` table schema, stripped `password_hash` from all serialized user responses, and enforced self-demotion protection (`409`) on `PATCH /users/:id/role`.
- What I would explain to a classmate: How bcrypt hashes passwords with a salt so plaintext passwords are never stored, how JWT Bearer tokens replace insecure `X-Demo-User` headers, and why Postman test suites need dynamic values (`{{$randomInt}}`) alongside seeded IDs to pass on a fresh `npm run db:reset` database.

## M2 · The question bank
- Dates worked: Nov 13, 2026 · Time spent: 1 hour
- Goal: Implement paginated, searchable, and allow-listed sortable question set lists, transactional nested CRUD for questions and choices, frozen-set edit protection (`409`), safe UUID-renamed cover image uploads, and an expanded 56-request Postman test suite.
- What I built: Updated `GET /question-sets` with `pageRules`, allow-listed `sortRules`, `Op.iLike` search (`?q=`), and `{ data, meta }` envelope pagination; added `?include=questions` eager loading on `GET /question-sets/:id`; built nested `GET`/`POST /question-sets/:id/questions` and `PATCH`/`DELETE /question-sets/:id/questions/:questionId` endpoints inside `sequelize.transaction` blocks with server-assigned positions, single-correct-choice validation (`400`), owner-only checks (`403`), and frozen-set checks (`409 SET_IN_USE`); created the `add-cover-url-to-question-sets` migration and `PUT /question-sets/:id/cover` endpoint using `multer` (`uploads/covers`) with static serving in `app.js`; and added the 13-request "Question bank" folder to `postman/Reach for the Stars API - Week 11.postman_collection.json`.
- Evidence: PR (`feature/question-bank` -> `main`) · Commits: `d942e9d` · `npm run check` passing all C and I fresh-database checks (56 requests, 56 tests, 0 failed).
- Problem I hit: PowerShell stripped double quotes inside inline `node -e` scripts and resolved `.NET` `WriteAllBytes` relative paths against the home directory rather than the repository root when generating the oversized `too-big.png` test fixture and updating the Postman JSON.
- How I solved it: Used `$PWD` for explicit file paths and switched to a PowerShell single-quoted here-string (`@' ... '@ | node`) so the Postman collection JSON updated cleanly without shell quote-stripping, allowing Newman to run all 56 requests (including multipart file uploads) reliably on a fresh database.
- Decision I made and why: Allow-listed sortable columns (`['id', 'title', 'subject', 'created_at']`) to prevent SQL injection through `ORDER BY`, wrapped question and choice writes in `sequelize.transaction` so partial records are never saved, and renamed uploaded cover images with `crypto.randomUUID()` while capping size at 1 MB (`413`) and restricting MIME types to PNG/JPEG (`400`) to prevent path traversal and filename collisions.
- Changes to my design set: Added a nullable `cover_url` column to the `question_sets` table schema, standardized `GET /question-sets` responses from a raw array to the `{ data, meta }` pagination envelope, and enforced `409 SET_IN_USE` immutability on question sets already referenced by a game session.
- What I would explain to a classmate: Why `ORDER BY` column names must be allow-listed rather than parameterized, how Sequelize `include` prevents N+1 query loops when loading sets with questions and choices, how database transactions keep parent-child inserts atomic, and why file uploads must be server-renamed and validated by MIME type and byte size.

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
