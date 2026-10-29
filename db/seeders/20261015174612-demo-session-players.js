'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const db = queryInterface.sequelize;

    // Fetch existing session
    const [sessions] = await db.query(`SELECT id FROM sessions ORDER BY id ASC LIMIT 1;`);
    
    // Fetch users with higher IDs to prevent collisions with earlier seed files
    const [users] = await db.query(`SELECT user_id FROM users WHERE user_id > 5 ORDER BY user_id ASC LIMIT 2;`);

    // If higher ID users don't exist yet, seed dedicated fallback users
    let playerUsers = users;
    if (playerUsers.length < 2) {
      await db.query(`
        INSERT INTO users (school_id, full_name, email, role, username, password_hash, created_at)
        VALUES 
          ('2099-0098', 'Lobby Player One', 'lobby1@test.test', 'PLAYER', 'lobbyuser1', 'hash', NOW()),
          ('2099-0099', 'Lobby Player Two', 'lobby2@test.test', 'PLAYER', 'lobbyuser2', 'hash', NOW())
        ON CONFLICT (school_id) DO NOTHING;
      `);
      [playerUsers] = await db.query(`SELECT user_id FROM users WHERE school_id IN ('2099-0098', '2099-0099') ORDER BY user_id ASC;`);
    }

    if (sessions.length > 0 && playerUsers.length >= 2) {
      await db.query(`
        INSERT INTO session_players (session_id, user_id, nickname, stars, correct_count, answer_count, joined_at)
        VALUES 
          (${sessions[0].id}, ${playerUsers[0].user_id}, 'SpeedyLobbyist', 0, 0, 0, NOW()),
          (${sessions[0].id}, ${playerUsers[1].user_id}, 'QuizMaster99', 0, 0, 0, NOW())
        ON CONFLICT (session_id, user_id) DO NOTHING;
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('session_players', null, {});
  }
};