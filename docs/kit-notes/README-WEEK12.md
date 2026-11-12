# CS 313 Week 12 Kit: accounts, passwords and tokens

Shared files for Week 12. Your migration, seeder, auth service, validators, controller and routes are your own (lab manual, Steps 2 to 5).

## Install (lab manual, Step 1)

1. On a new branch `feature/auth`, copy `.github`, `scripts` and `src` from this kit into your repository. Say yes to replacing `.github/workflows/check.yml`, `scripts/ci-check.js`, `src/middlewares/current-user.js` and `src/errors/app-error.js`.
2. `src/models/user.js` and `src/repositories/user.repository.js`: if you changed yours since Week 11, copy your changes in. The model now has `password_hash` and hides it by default.
3. `npm install bcryptjs jsonwebtoken`
4. Add `JWT_SECRET` (64 random hex characters) and `JWT_EXPIRES_IN=1h` to `.env` and to `.env.example` (with a placeholder value there), and add `'JWT_SECRET'` to the `REQUIRED` list in `src/config/env.js`.
5. Commit with the message `chore: install the Week 12 check` and push. The two check files must stay exactly as they are in this kit.

## What each file does

| File | Job |
|---|---|
| `.github/workflows/check.yml` | The Week 12 workflow: downloads the official check from the class template on every push |
| `scripts/ci-check.js` | The same check, for `npm run check` on your computer |
| `src/security/password.js` | bcrypt hash and compare, with a dummy hash for unknown accounts |
| `src/security/token.js` | Sign and verify JWTs (HS256, `JWT_SECRET`, `JWT_EXPIRES_IN`) |
| `src/middlewares/current-user.js` | Reads `Authorization: Bearer <token>` into `req.user` (replaces X-Demo-User) |
| `src/errors/app-error.js` | `unauthorized(message, code)` now takes a code (`AUTH_REQUIRED` or `INVALID_TOKEN`) |
| `src/repositories/user.repository.js` | `findForLogin` (the only query that reads the hash), `findById`, `create`, `update` |
| `src/models/user.js` | The users table with `password_hash` and the `withPassword` scope |
