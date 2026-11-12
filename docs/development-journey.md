# Development journey: [Reach for the Stars] API

Student: [Kendra Shanice R. Tan] · Section: [3-1] · Group: [5]

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: [Nov 12, 2026] · Time spent: [2]
- Goal: [Set up the Weeks 12-18 project kit and implement secure user authentication, password hashing, and token verification.]
- What I built: [Installed the Weeks 12-18 kit structure (.github checks, security helpers, test folders), configured environment variables for JWT, created the database migration for `password_hash`, and set up auth validators and services.]
- Evidence: [PR #1 (feature/auth -> main)] · [Commits: `668b048`, `[next_commit_hash]`]
- Problem I hit: [Encountered a database migration error stating that the `password_hash` column already existed when running `npm run db:migrate`.]
- How I solved it: [Reset the database state cleanly to resync the migration history and schema correctly.]
- Decision I made and why: [Used a 64-character cryptographically secure random hex string for `JWT_SECRET` to ensure token signatures cannot be easily forged or brute-forced.]
- Changes to my design set: [Added the `password_hash` column to the `users` table schema and ensured sensitive hashes are excluded by default in the user model.]
- What I would explain to a classmate: [How bcrypt hashes passwords with a generated salt so that raw user passwords are never stored in plaintext in the database.]

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
