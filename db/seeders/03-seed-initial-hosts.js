'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. Get host ID (from users table or legacy hosts table)
    const [userHosts] = await db.query(`SELECT user_id FROM users WHERE role = 'HOST' LIMIT 1;`);
    const [legacyHosts] = await db.query(`SELECT id FROM hosts LIMIT 1;`);

    const hostUserId = userHosts.length > 0 ? userHosts[0].user_id : null;
    const legacyHostId = legacyHosts.length > 0 ? legacyHosts[0].id : 1;

    // 2. Fetch existing users for the game players
    const [users] = await db.query(`SELECT user_id FROM users ORDER BY user_id ASC LIMIT 4;`);

    if (users.length < 2) {
      // Create fallback users only if none exist
      const [newUsers] = await db.query(`
        INSERT INTO users (school_id, full_name, email, role, username, password_hash, created_at)
        VALUES 
          ('2099-0004', 'Carlo Cruz', 'carlo@test.test', 'PLAYER', 'user3', 'hash', NOW()),
          ('2099-0005', 'Dana Diaz', 'dana@test.test', 'PLAYER', 'user4', 'hash', NOW())
        RETURNING user_id;
      `);
      users.push(...newUsers);
    }

    // 3. Seed Question Set
    const [sets] = await db.query(`
      INSERT INTO question_sets (host_id, title, description, subject, created_at)
      VALUES (${hostUserId || legacyHostId}, 'Library Orientation', 'Basic quiz', 'General', NOW())
      RETURNING id;
    `);
    const setId = sets[0].id;

    // 4. Seed Questions
    const [q1] = await db.query(`
      INSERT INTO questions (question_set_id, position, text, type, time_limit_sec)
      VALUES (${setId}, 1, 'Q1 text', 'multiple_choice', 20) RETURNING id;
    `);
    const [q2] = await db.query(`
      INSERT INTO questions (question_set_id, position, text, type, time_limit_sec)
      VALUES (${setId}, 2, 'Q2 text', 'multiple_choice', 20) RETURNING id;
    `);

    // 5. Seed Choices
    await db.query(`
      INSERT INTO choices (question_id, choice_index, text, is_correct)
      VALUES 
        (${q1[0].id}, 0, 'A', true), (${q1[0].id}, 1, 'B', false),
        (${q2[0].id}, 0, 'A', true), (${q2[0].id}, 1, 'B', false);
    `);

    // 6. Seed Session
    const [sessions] = await db.query(`
      INSERT INTO sessions (host_id, question_set_id, join_code, status, duration_sec, started_at, ended_at, created_at)
      VALUES (${hostUserId || legacyHostId}, ${setId}, '482731', 'ENDED', 300, NOW() - INTERVAL '10 MINUTE', NOW(), NOW())
      RETURNING id;
    `);
    const sessionId = sessions[0].id;

    // 7. Seed Session Players
    const [players] = await db.query(`
      INSERT INTO session_players (session_id, user_id, nickname, stars, correct_count, answer_count, joined_at)
      VALUES 
        (${sessionId}, ${users[0].user_id}, 'Player1', 5, 2, 2, NOW()),
        (${sessionId}, ${users[1].user_id}, 'Player2', 4, 2, 2, NOW())
      RETURNING id;
    `);

    // 8. Seed Answers
    for (let i = 0; i < players.length; i++) {
      const [ans] = await db.query(`
        INSERT INTO answers (player_id, question_id, is_correct, answer_time_ms, stars_earned)
        VALUES 
          (${players[i].id}, ${q1[0].id}, true, 1200, 1),
          (${players[i].id}, ${q2[0].id}, true, 1500, 1)
        RETURNING id;
      `);

      // 9. Seed Chest Offers & Chest Slots
      const [chests] = await db.query(`
        INSERT INTO chest_offers (answer_id, player_id, status)
        VALUES (${ans[0].id}, ${players[i].id}, 'OPENED')
        RETURNING id;
      `);
      await db.query(`
        INSERT INTO chest_slots (chest_offer_id, slot_number, reward_type)
        VALUES 
          (${chests[0].id}, 1, 'DOUBLE_STAR'),
          (${chests[0].id}, 2, 'PROTECTION_CARD'),
          (${chests[0].id}, 3, 'EMPTY');
      `);
    }
  },

  async down(queryInterface) {
    const db = queryInterface.sequelize;
    await db.query(`TRUNCATE question_sets, questions, choices, sessions, session_players, answers, chest_offers, chest_slots CASCADE;`);
  }
};