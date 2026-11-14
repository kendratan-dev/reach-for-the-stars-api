# Data dictionary

Generated from the database by `npm run docs:dictionary` on 2026-11-14, then described by hand.

### `answers`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `player_id` | integer | no |  | ; FK REFERENCES session_players(id) ON DELETE CASCADE; UNIQUE (uq_answer_player_question) | [Your description] |
| `question_id` | integer | no |  | ; FK REFERENCES questions(id) ON DELETE CASCADE; UNIQUE (uq_answer_player_question) | [Your description] |
| `choice_id` | integer | yes |  | FK REFERENCES choices(id) ON DELETE SET NULL | [Your description] |
| `is_correct` | boolean | no |  |  | [Your description] |
| `answer_time_ms` | integer | no |  |  | [Your description] |
| `stars_earned` | integer | no | `0` |  | [Your description] |
| `streak_after` | integer | no | `0` |  | [Your description] |
| `double_star_used` | boolean | no | `false` |  | [Your description] |
| `protection_used` | boolean | no | `false` |  | [Your description] |
| `created_at` | timestamp with time zone | no | `CURRENT_TIMESTAMP` |  | [Your description] |

### `chest_offers`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `answer_id` | integer | no |  | ; UNIQUE (chest_offers_answer_id_key); FK REFERENCES answers(id) ON DELETE CASCADE | [Your description] |
| `player_id` | integer | no |  | ; FK REFERENCES session_players(id) ON DELETE CASCADE | [Your description] |
| `status` | character varying(50) | no | `'PENDING'` |  | [Your description] |
| `picked_slot` | integer | yes |  |  | [Your description] |
| `created_at` | timestamp with time zone | no | `CURRENT_TIMESTAMP` |  | [Your description] |
| `opened_at` | timestamp with time zone | yes |  |  | [Your description] |

### `chest_slots`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `chest_offer_id` | integer | no |  | ; FK REFERENCES chest_offers(id) ON DELETE CASCADE | [Your description] |
| `slot_number` | integer | no |  |  | [Your description] |
| `reward_type` | character varying(50) | no |  |  | [Your description] |

### `choices`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `question_id` | integer | no |  | ; FK REFERENCES questions(id) ON DELETE CASCADE | [Your description] |
| `choice_index` | integer | no |  |  | [Your description] |
| `text` | text | no |  |  | [Your description] |
| `is_correct` | boolean | no | `false` |  | [Your description] |

### `hosts`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `username` | character varying(50) | no |  | ; UNIQUE (hosts_username_key) | [Your description] |
| `password_hash` | character varying(255) | no |  |  | [Your description] |
| `display_name` | character varying(100) | no |  |  | [Your description] |
| `created_at` | timestamp with time zone | no | `CURRENT_TIMESTAMP` |  | [Your description] |

### `question_sets`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `host_id` | integer | no |  | ; FK REFERENCES hosts(id) ON DELETE CASCADE | [Your description] |
| `title` | character varying(255) | no |  |  | [Your description] |
| `description` | text | yes |  |  | [Your description] |
| `subject` | character varying(100) | yes |  |  | [Your description] |
| `grade_level` | character varying(50) | yes |  |  | [Your description] |
| `created_at` | timestamp with time zone | no | `CURRENT_TIMESTAMP` |  | [Your description] |
| `cover_url` | character varying(255) | yes |  |  | [Your description] |

### `questions`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `question_set_id` | integer | no |  | ; FK REFERENCES question_sets(id) ON DELETE CASCADE | [Your description] |
| `position` | integer | no |  |  | [Your description] |
| `text` | text | no |  |  | [Your description] |
| `type` | character varying(50) | no |  |  | [Your description] |
| `time_limit_sec` | integer | no | `30` |  | [Your description] |

### `session_players`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `session_id` | integer | no |  | ; FK REFERENCES sessions(id) ON DELETE CASCADE; UNIQUE (uq_session_user_seat) | [Your description] |
| `nickname` | character varying(50) | no |  |  | [Your description] |
| `stars` | integer | no | `0` |  | [Your description] |
| `current_streak` | integer | no | `0` |  | [Your description] |
| `best_streak` | integer | no | `0` |  | [Your description] |
| `correct_count` | integer | no | `0` |  | [Your description] |
| `answer_count` | integer | no | `0` |  | [Your description] |
| `total_answer_ms` | bigint | no | `0` |  | [Your description] |
| `double_star_ready` | boolean | no | `false` |  | [Your description] |
| `protection_ready` | boolean | no | `false` |  | [Your description] |
| `current_question_id` | integer | yes |  | FK REFERENCES questions(id) ON DELETE SET NULL | [Your description] |
| `question_served_at` | timestamp with time zone | yes |  |  | [Your description] |
| `joined_at` | timestamp with time zone | no | `CURRENT_TIMESTAMP` |  | [Your description] |
| `user_id` | integer | yes |  | FK REFERENCES users(user_id) ON DELETE SET NULL; UNIQUE (uq_session_user_seat) | [Your description] |

### `sessions`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `id` | integer | no | auto number | ; PK | [Your description] |
| `host_id` | integer | no |  | ; FK REFERENCES hosts(id) ON DELETE CASCADE | [Your description] |
| `question_set_id` | integer | no |  | ; FK REFERENCES question_sets(id) ON DELETE RESTRICT | [Your description] |
| `join_code` | character varying(10) | no |  | ; UNIQUE (sessions_join_code_key) | [Your description] |
| `status` | character varying(50) | no | `'WAITING'` |  | [Your description] |
| `duration_sec` | integer | no |  |  | [Your description] |
| `started_at` | timestamp with time zone | yes |  |  | [Your description] |
| `ends_at` | timestamp with time zone | yes |  |  | [Your description] |
| `ended_at` | timestamp with time zone | yes |  |  | [Your description] |
| `created_at` | timestamp with time zone | no | `CURRENT_TIMESTAMP` |  | [Your description] |
| `current_position` | integer | yes |  |  | [Your description] |
| `question_started_at` | timestamp with time zone | yes |  |  | [Your description] |

### `users`

| Column | Type | Null | Default | Keys and rules | Description |
|---|---|---|---|---|---|
| `user_id` | integer | no | auto number | ; PK | [Your description] |
| `school_id` | character varying(20) | no |  | ; UNIQUE (users_school_id_key) | [Your description] |
| `full_name` | character varying(100) | no |  |  | [Your description] |
| `email` | character varying(100) | no |  | ; UNIQUE (users_email_key) | [Your description] |
| `role` | character varying(20) | no | `'STUDENT'` |  | [Your description] |
| `username` | character varying(50) | no |  | ; UNIQUE (users_username_key) | [Your description] |
| `password_hash` | character varying(255) | no |  |  | [Your description] |
| `created_at` | timestamp with time zone | no | `now()` |  | [Your description] |

