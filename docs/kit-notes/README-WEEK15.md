# CS 313 Week 15 Kit: OpenAPI, Swagger UI and the Week 15 check

## Install (lab manual, Step 1)

1. On `feature/api-docs`, copy `scripts`, `src` and `tests` into your repository. Replace `scripts/ci-check.js`. Commit: `chore: update the check to Week 15`.
2. `npm install swagger-ui-express yaml`
3. In `src/routes/index.js`, next to the Hub endpoints (before `currentUser`): `router.use(require('./docs.routes'));`
4. Replace every CHANGE_ME in `src/docs/openapi.yaml`, then document every endpoint of your game.

| File | Job |
|---|---|
| `src/routes/docs.routes.js` | `GET /api/v1/openapi.json` and Swagger UI at `/api/v1/docs/` |
| `src/docs/openapi.yaml` | Starter: components, the Hub Contract and the account endpoints |
| `tests/api/docs.api.test.js` | Every operation has a summary and responses; at least 15 operations |
| `scripts/ci-check.js` | Week 15 lines M (docs) and N (the live API named in your README) |
