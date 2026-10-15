'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_players', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sessions', key: 'id' },
        onDelete: 'CASCADE'
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      stars: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      current_streak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      best_streak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      correct_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      answer_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_answer_ms: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      double_star_ready: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      protection_ready: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      current_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'questions', key: 'id' },
        onDelete: 'SET NULL'
      },
      question_served_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session_players');
  }
};