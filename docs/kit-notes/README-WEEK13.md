# CS 313 Week 13 Kit: lists, uploads and the Week 13 check

## Install (lab manual, Step 1)

1. On `feature/question-bank` (name it after your content), copy `scripts`, `src`, `postman` and `uploads` into your repository. Replace `scripts/ci-check.js`.
2. `npm install multer`
3. Add to `.gitignore`:
   ```
   uploads/*/*
   !uploads/*/.gitkeep
   ```
4. In `src/app.js`, before the routes: `app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));`
5. Commit: `chore: update the check to Week 13`.

## What each file does

| File | Job |
|---|---|
| `scripts/ci-check.js` | Week 13 lines: at least 45 Postman requests, and your collection must play a game to the end (`/results`) |
| `src/utils/paginate.js` | `toOffset({ page, limit })` and the `{ data, meta }` envelope |
| `src/validators/list.validator.js` | `pageRules` and `sortRules(allowedColumns)` |
| `src/middlewares/upload-cover.js` | multer: one PNG or JPEG, at most 1 MB, a server-chosen name. Rename it for your game's picture |
| `postman/fixtures/` | A small PNG and a text file for the upload tests |
