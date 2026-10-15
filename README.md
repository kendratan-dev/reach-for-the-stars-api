# Reach for the Stars API

Backend API for **Reach for the Stars**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Kendra Shanice Tan (kendratan-dev), BSCS 3-1
- Group and game concept: Team 5 & Reach for the Stars is a library-hosted multiplayer trivia tournament where players independently answer educational questions, earn stars, use strategic mystery-chest rewards, and compete to finish with the highest score before the round timer ends.

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 24.21.0 |
| Web framework | Express 5 |
| Database | PostgreSQL 18.6 |
| ORM and migrations | Sequelize ORM 6.37.8  with Sequelize-CLI 6.6.5 |

## Setup

```
git clone https://github.com/kendratan-dev/reach-for-the-stars-api
cd [reach-for-the-stars-api]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | reach_for_the_stars | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | postgres | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | reach-for-the-stars, Reach for the Stars, Team 5, Kendra Shanice Tan, Reach for the Stars is a library-hosted multiplayer trivia tournament where players independently answer educational questions, earn stars, use strategic mystery-chest rewards, and compete to finish with the highest score before the round timer ends, 1-30 players, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player completed the game when they answered every question, even if some answers were wrong or timed out.

## Tables

1. `hosts` — Stores host/librarian account credentials and login information[cite: 5, 8, 21].
2. `question_sets` — Stores reusable quiz collections created by hosts[cite: 5, 8, 9, 21].
3. `questions` — Stores individual question prompts and time limits[cite: 5, 9, 21].
4. `choices` — Stores multiple-choice options for each question[cite: 5, 10, 21].
5. `sessions` — Represents a active or ended game room instance and main timer state[cite: 5, 10, 11, 21].
6. `session_players` — Tracks joined players, scores, active streaks, and power-up availability[cite: 5, 11, 12, 13, 21].
7. `answers` — Records player response submissions, answer timing, and stars earned[cite: 5, 13, 21].
8. `chest_offers` — Stores 5-streak mystery chest reward opportunities[cite: 5, 21].
9. `chest_slots` — Stores individual reward choices (Double Star, Protection Card, Empty) for a chest offer[cite: 5, 21].

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |