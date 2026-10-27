'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0001',
        username: 'juan_host',
        password_hash: '$2b$10$dummyhashforweek11testingonly',
        full_name: 'Juan Dela Cruz',
        email: 'juan.delacruz@reachforthestars.test',
        role: 'HOST',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0001' }, {});
  }
};