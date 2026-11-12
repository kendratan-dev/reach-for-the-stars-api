# CS 313 Week 16 Kit: the SE1 portfolio

## Install (lab manual, Step 1)

1. On `feature/portfolio`, copy `scripts`, `docs` and `CHANGELOG.md` into your repository. Replace `scripts/ci-check.js`. Commit: `chore: update the check to Week 16`.
2. In `package.json` scripts: `"docs:dictionary": "node scripts/make-data-dictionary.js"` and `"docs:api": "node scripts/make-api-reference.js"`.
3. `npm run db:migrate`, then `npm run docs:dictionary` and `npm run docs:api`.
4. Replace every `[Your ...]` in `docs/` and `CHANGELOG.md`. Put the six diagrams in `docs/diagrams/`.

| File | Job |
|---|---|
| `scripts/make-data-dictionary.js` | Writes `docs/data-dictionary.md` from the database; keeps the descriptions you write |
| `scripts/make-api-reference.js` | Writes `docs/api-reference.md` from `src/docs/openapi.yaml` |
| `docs/technical-spec.md`, `user-guide.md`, `se2-handoff.md` | Templates with the sections the rubric looks for |
| `CHANGELOG.md` | Template, newest first |
| `scripts/ci-check.js` | Week 16 line O: the five documents, no placeholders, every table described, six diagrams |
