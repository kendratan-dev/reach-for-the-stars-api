# CS 313 Week 14 Kit: Jest, supertest and deployment preparation

## Install (lab manual, Step 1)

1. On `feature/tests`, copy `scripts` and `tests` into your repository. Replace `scripts/ci-check.js`. Commit: `chore: update the check to Week 14`.
2. `npm install -D jest supertest` and `npm install cors helmet`
3. In `package.json` add:
   ```json
   "scripts": { "test": "jest --runInBand", "test:coverage": "jest --runInBand --coverage" },
   "jest": {
     "testEnvironment": "node",
     "globalSetup": "./tests/setup/global-setup.js",
     "collectCoverageFrom": ["src/**/*.js", "!src/server.js"],
     "coverageReporters": ["text-summary", "html"]
   }
   ```
4. In `tests/setup/helpers.js`, set `DEMO_PASSWORD` to your own seeders' demo password.
5. `src/config/env.js`: use `<DB_NAME>_test` when `NODE_ENV` is `test`, require `CORS_ORIGINS`, accept `DATABASE_URL` (lab manual, Step 2 and Step 5).
6. Add `coverage/` to `.gitignore`.

## What each file does

| File | Job |
|---|---|
| `tests/setup/global-setup.js` | Creates and rebuilds the test database before every run |
| `tests/setup/helpers.js` | `app`, `request` and `bearer(schoolId)` for HTTP tests |
| `tests/unit/example.results.service.test.js` | A unit test of the template's `rankPlayers`: runs as it is |
| `tests/api/example.hub.api.test.js` | HTTP tests of the Hub endpoints and CORS: runs as it is |
| `scripts/create-admin.js` | The first ADMIN on a server with no seed data |
| `render.yaml` | Render Blueprint: rename every CHANGE-ME |
