'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. Seed Host
    const [hosts] = await db.query(`
      INSERT INTO hosts (username, password_hash, display_name, created_at)
      VALUES ('librarian_kendra', '$2b$10$xyz', 'Kendra Tan', NOW())
      RETURNING id;
    `);
    const hostId = hosts[0].id;

    // 2. Seed Users
    const [users] = await db.query(`
      INSERT INTO users (school_id, full_name, email, role, username, password_hash, created_at)
      VALUES 
        ('2099-0001', 'Ana Santos', 'ana@test.test', 'STUDENT', 'user1', 'hash', NOW()),
        ('2099-0002', 'Ben Reyes', 'ben@test.test', 'STUDENT', 'user2', 'hash', NOW()),
        ('2099-0003', 'Carlo Cruz', 'carlo@test.test', 'STUDENT', 'user3', 'hash', NOW()),
        ('2099-0004', 'Dana Diaz', 'dana@test.test', 'STUDENT', 'user4', 'hash', NOW())
      RETURNING user_id;
    `);

    // 3. Seed Question Set
    const [sets] = await db.query(`
      INSERT INTO question_sets (host_id, title, description, subject, created_at)
      VALUES (${hostId}, 'Library Orientation', 'Basic quiz', 'General', NOW())
      RETURNING id;
    `);
    const setId = sets[0].id;

    // 4. Seed Questions (2 questions)
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

    // 6. Seed Session (STATUS = 'ENDED')
    const [sessions] = await db.query(`
      INSERT INTO sessions (host_id, question_set_id, join_code, status, duration_sec, started_at, ended_at, created_at)
      VALUES (${hostId}, ${setId}, '482731', 'ENDED', 300, NOW() - INTERVAL '10 MINUTE', NOW(), NOW())
      RETURNING id;
    `);
    const sessionId = sessions[0].id;

    // 7. Seed Session Players (4 players: 3 completed, 1 incomplete)
    const [players] = await db.query(`
      INSERT INTO session_players (session_id, user_id, nickname, stars, correct_count, answer_count, joined_at)
      VALUES 
        (${sessionId}, ${users[0].user_id}, 'Ana', 5, 2, 2, NOW()),
        (${sessionId}, ${users[1].user_id}, 'Ben', 4, 2, 2, NOW()),
        (${sessionId}, ${users[2].user_id}, 'Carlo', 3, 2, 2, NOW()),
        (${sessionId}, ${users[3].user_id}, 'Dana', 1, 1, 1, NOW())
      RETURNING id;
    `);

    // 8. Seed Answers for 3 completed players (2 answers each)
    for (let i = 0; i < 3; i++) {
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
    await db.query(`TRUNCATE users, hosts, question_sets, questions, choices, sessions, session_players, answers, chest_offers, chest_slots CASCADE;`);
  }
};