# CS 313 Weeks 12 to 18 Kit

Every shared file for the rest of SE1, in one kit. Install it once, at the start of
Milestone 1 (Self-Paced Module, "Setup"). Your migrations, seeders, validators,
services, controllers, routes, tests, documents and journey are your own.

## Install (once)

1. `git switch main`, `git pull`, `git switch -c feature/auth`
2. Copy everything in this folder into your repository. Replace `check.yml`,
   `ci-check.js`, `current-user.js` and `app-error.js` when asked.
3. If you changed `src/models/user.js` or `src/repositories/user.repository.js`
   in Week 11, copy your changes into the kit versions.
4. `npm install bcryptjs jsonwebtoken multer cors helmet swagger-ui-express yaml sequelize-cli`
   and `npm install -D jest supertest`
5. `.env` and `.env.example`: `JWT_SECRET`, `JWT_EXPIRES_IN=1h`, `CORS_ORIGINS=http://localhost:5173`.
   Add `JWT_SECRET` and `CORS_ORIGINS` to REQUIRED in `src/config/env.js`.
6. `.gitignore`: `coverage/`, `uploads/*/*`, `!uploads/*/.gitkeep`
7. `git add -A`, `git commit -m "chore: install the Weeks 12-18 kit"`, `git push -u origin feature/auth`

Never change `.github/workflows/check.yml` or `scripts/ci-check.js`.
The check now tests lines A to O. Lines for milestones you have not reached are red:
they are your to-do list.

## Which file is for which milestone

| Milestone | Files |
|---|---|
| M1 Accounts | `src/security/`, `src/middlewares/current-user.js`, `src/errors/app-error.js`, `src/models/user.js`, `src/repositories/user.repository.js` |
| M2 Question bank | `src/utils/paginate.js`, `src/validators/list.validator.js`, `src/middlewares/upload-cover.js`, `postman/fixtures/`, `uploads/` |
| M4 Tests and server | `tests/setup/`, `tests/unit/example...`, `tests/api/example...`, `scripts/create-admin.js`, `render.yaml` |
| M5 Docs and deploy | `src/docs/openapi.yaml`, `src/routes/docs.routes.js`, `tests/api/docs.api.test.js.later` (rename it in M5) |
| M6 Portfolio | `docs/`, `CHANGELOG.md`, `scripts/make-data-dictionary.js`, `scripts/make-api-reference.js` |
| Journey | `docs/development-journey.md`: one entry per milestone |

`docs/kit-notes/` keeps the notes of the weekly kits, for reference.
