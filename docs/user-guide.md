# User guide: Reach for the Stars API

How each kind of user works with the API. Base URL: https://reach-for-the-stars-kendratan.onrender.com/api/v1. Every endpoint can be tried in Swagger UI at `/docs/`.

## Players

1. Create an account via `POST /auth/register` (automatically assigned PLAYER role).
2. Log in via `POST /auth/login` to receive your JWT token and include it in the `Authorization: Bearer <token>` header.
3. Join a game session using `POST /api/v1/sessions/:id/players`. Rejoining resumes existing player state.
4. Play through questions by submitting answers to `POST /api/v1/sessions/:id/answers`.
5. Check real-time standings via `GET /api/v1/sessions/:id/leaderboard`.

A player counts as having completed a game when they finish all questions in a session before game closure.

## Hosts

1. Prepare question sets and questions using `POST /api/v1/question-sets`.
2. Start a game session and share the session code with players.
3. Monitor and run the game session to completion.

## Admins

Admins manage user accounts and roles via admin endpoints (e.g., updating user roles). The initial admin account is provisioned during server startup/seeding.

## The Library Game Hub

The Hub queries finished game results via `GET /api/v1/results` using the `X-Hub-Key` header, supporting `?since=` timestamp filtering.

## When something goes wrong

Errors return in a standardized JSON error format with appropriate HTTP status codes (e.g., 400 for validation errors, 401 for unauthorized access, 409 for conflicts, 404 for missing resources).