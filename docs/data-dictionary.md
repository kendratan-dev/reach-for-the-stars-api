# Data Dictionary - Reach for the Stars API

## Tables Overview
1. **users**: Stores registered accounts (students, hosts, admins). Fields: id, school_id, username, ull_name, email, password_hash, ole, created_at, updated_at.
2. **question_sets**: Stores question bank collections. Fields: id, 	itle, subject, cover_url, created_at, updated_at.
3. **questions**: Stores individual quiz questions belonging to question sets. Fields: id, question_set_id, prompt, position, created_at, updated_at.
4. **choices**: Stores selectable answer choices for questions. Fields: id, question_id, 	ext, is_correct, created_at, updated_at.
5. **sessions**: Stores active and finished game sessions. Fields: id, code, host_id, question_set_id, status, current_position, question_started_at, created_at, updated_at.
6. **session_players**: Stores players joined to a game session. Fields: id, session_id, user_id, score, created_at, updated_at.
7. **answers**: Stores submitted answers by players for questions. Fields: id, player_id, question_id, choice_id, is_correct, points, created_at, updated_at.
8. **hosts**: Stores host profile mappings and organization details. Fields: id, 
ame, created_at, updated_at.
9. **chest_offers**: Game reward offers available for sessions. Fields: id, 	itle, created_at, updated_at.
10. **chest_slots**: Player inventory slots for rewards and unlocked chests. Fields: id, player_id, chest_offer_id, created_at, updated_at.

