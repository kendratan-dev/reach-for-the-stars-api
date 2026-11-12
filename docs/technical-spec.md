# Technical specification: [Your Game Title] API

Version [x.y.z], SE1 final build. Developer: [Your full name] ([your GitHub username]), BSCS [3-1 or 3-2]. Group: [Group name].

## 1. Purpose and scope

[Your description: what the game is, who plays it, who hosts it, what the Library Game Hub reads. Say what SE1 covers (the backend) and what SE2 will add (the frontend).]

## 2. Architecture

![Architecture](diagrams/architecture.png)

[Your description: the path of one request through your middleware and layers.]

| Layer | Folder | Responsibility | Never |
|---|---|---|---|
| Routes | `src/routes` | [Your description] | [Your description] |
| Validators | `src/validators` | [Your description] | [Your description] |
| Controllers | `src/controllers` | [Your description] | [Your description] |
| Services | `src/services` | [Your description] | [Your description] |
| Repositories | `src/repositories` | [Your description] | [Your description] |
| Models | `src/models` | [Your description] | [Your description] |

## 3. Data

[Your description: how many tables, and a link to data-dictionary.md.]

![ERD](diagrams/erd.png)

[Your description: the rules your database enforces by itself (UNIQUE, CHECK, foreign keys) and which code each becomes in constraint-map.js.]

## 4. Security

| Concern | Decision |
|---|---|
| Passwords | [Your description] |
| Login and tokens | [Your description] |
| Roles | [Your description] |
| Input | [Your description] |
| Your game's trust boundary | [Your description: what the server decides instead of the client] |
| Browsers (CORS) | [Your description] |
| The Hub | [Your description] |

## 5. Quality

[Your description: number of Jest tests (unit and HTTP), line coverage, the Postman run (requests and tests), the automatic check.]

## 6. Deployment

[Your description: Render web service and database, the start command, the live address, the free-plan limits.]

## 7. Decisions and their reasons

| Decision | Reason | Alternative not taken |
|---|---|---|
| [Your decision] | [Your reason] | [Your alternative] |
| [Your decision] | [Your reason] | [Your alternative] |
| [Your decision] | [Your reason] | [Your alternative] |
