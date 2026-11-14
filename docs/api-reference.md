# API reference: Reach for the Stars API 1.0.0

Generated from `src/docs/openapi.yaml` by `npm run docs:api`. Base URL: `/api/v1`. Try every endpoint in Swagger UI at `/api/v1/docs/`.

Every error answers `{ "error": { "code": "...", "message": "..." } }`. "Login" means the header `Authorization: Bearer <token>`.

## Hub Contract

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/health` | Is the API up, and can it reach the database? | nothing | 200, 503 |
| GET | `/game-info` | What the Hub shows about this game | nothing | 200 |
| GET | `/results` | Finished games, every player, and the podium (rule 7) | X-Hub-Key | 200, 400, 401 |

## Accounts

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/auth/register` | Create a PLAYER account | nothing | 201, 400, 409 |
| POST | `/auth/login` | School ID and password in, a token out | nothing | 200, 400, 401 |
| GET | `/auth/me` | The account of the token | login | 200, 401 |

## Users

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/users` | List all users (Admin only) | login | 200, 401 |
| PATCH | `/users/{id}/role` | Update user role (Admin only) | login | 200, 401 |

## Question Sets

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/question-sets` | List paginated question sets | nothing | 200 |
| POST | `/question-sets` | Create a new question set (Host / Admin) | login | 201, 401 |
| GET | `/question-sets/{id}` | Get question set details with optional questions include | nothing | 200, 404 |

## Questions

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/question-sets/{id}/questions` | Add a question to a question set | login | 201, 400 |

## Sessions

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/sessions` | Create a new game session | login | 201, 401 |
| GET | `/sessions/{code}` | Get session details by join code | nothing | 200, 404 |
| PATCH | `/sessions/{code}` | Update session status or position (Host) | login | 200 |
| POST | `/sessions/{code}/players` | Join a game session as a player | login | 201 |

## Gameplay

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/sessions/{code}/question` | Get the current active question for a running session | login | 200 |
| POST | `/sessions/{code}/answers` | Submit an answer for the current active question | login | 201, 409 |
| GET | `/sessions/{code}/leaderboard` | Get the current leaderboard for a session | login | 200 |

