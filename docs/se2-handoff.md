# SE2 handoff: building the Reach for the Stars frontend

## Connection

| Item | Value |
|---|---|
| Base URL (production) | https://reach-for-the-stars-kendratan.onrender.com/api/v1 |
| Base URL (local) | http://localhost:3001/api/v1 |
| Contract | Hub Contract v1.3; Swagger UI at `/docs/`, `src/docs/openapi.yaml` |
| CORS | CORS_ORIGINS must include the frontend origin (e.g., http://localhost:5173) |
| Login | Send JWT token in the `Authorization: Bearer <token>` header. On 401 Unauthorized, clear stored auth state and redirect the user to the login screen. |
| First request | Render free tier web service sleeps after 15 minutes of inactivity; the first request may take up to 50 seconds to wake up the server. |

## Screens and the endpoints they use

| Screen | Endpoints |
|---|---|
| Auth (Register / Login) | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Question Bank & Sets | `GET /api/v1/question-sets`, `POST /api/v1/question-sets`, `POST /api/v1/question-sets/:id/questions` |
| Game Lobby & Sessions | `POST /api/v1/sessions`, `GET /api/v1/sessions/:id`, `POST /api/v1/sessions/:id/players` |
| Active Gameplay | `GET /api/v1/sessions/:id/question`, `POST /api/v1/sessions/:id/answers`, `GET /api/v1/sessions/:id/leaderboard` |
| Results & History | `GET /api/v1/results` |

## Known limits and the SE2 backlog

1. Real-time multiplayer synchronization currently relies on REST polling rather than WebSockets.
2. File uploads for question set cover images are stored locally in the container filesystem (ephemeral on Render).
3. Pagination on question sets and search results can be expanded for large datasets.