'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('hosts', [
      {
        id: 5,
        username: 'demo_host_5',
        password_hash: '$2b$10$demo_password_hash_placeholder',
        display_name: 'Demo Host 5',
        created_at: new Date(),
      },
      {
        id: 1,
        username: 'demo_host_1',
        password_hash: '$2b$10$demo_password_hash_placeholder',
        display_name: 'Demo Host 1',
        created_at: new Date(),
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hosts', { id: [1, 5] }, {});
  }
};