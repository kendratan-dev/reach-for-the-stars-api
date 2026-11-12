'use strict';
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('Pass1234!', 10);

    // 1. Ensure a demo ADMIN user exists for M1 testing
    await queryInterface.bulkInsert(
      'users',
      [
        {
          school_id: '2026-0000',
          username: 'admin1',
          full_name: 'System Admin',
          email: 'admin@reachforthestars.test',
          role: 'ADMIN',
          password_hash: hash,
          created_at: new Date(),
        },
      ],
      { ignoreDuplicates: true }
    );

    // 2. Set the demo password for all existing seeded users
    await queryInterface.bulkUpdate(
      'users',
      { password_hash: hash },
      {
        password_hash: {
          [Op.or]: [null, 'dummy_hash', 'hash'],
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2026-0000' }, {});
    await queryInterface.bulkUpdate('users', { password_hash: null }, {});
  },
};