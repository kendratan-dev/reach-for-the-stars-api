'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0003', // Changed to a unique school ID
        username: 'ben_host2',  // Unique username
        password_hash: '$2b$10$dummyhashforweek11testingonly',
        full_name: 'Ben Castro',
        email: 'ben.castro@reachforthestars.test',
        role: 'HOST',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0003' }, {});
  }
};