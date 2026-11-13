'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sessions', 'current_position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('sessions', 'question_started_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addConstraint('answers', {
      fields: ['player_id', 'question_id'],
      type: 'unique',
      name: 'uq_answer_player_question',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('answers', 'uq_answer_player_question');
    await queryInterface.removeColumn('sessions', 'question_started_at');
    await queryInterface.removeColumn('sessions', 'current_position');
  },
};