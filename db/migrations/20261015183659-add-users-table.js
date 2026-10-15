'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create users table
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      school_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'STUDENT',
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // 2. Add user_id column to session_players
    await queryInterface.addColumn('session_players', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onDelete: 'SET NULL',
    });

    // 3. Add UNIQUE constraint (session_id, user_id)
    await queryInterface.addConstraint('session_players', {
      type: 'unique',
      name: 'uq_session_user_seat',
      fields: ['session_id', 'user_id'],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('session_players', 'uq_session_user_seat');
    await queryInterface.removeColumn('session_players', 'user_id');
    await queryInterface.dropTable('users');
  },
};