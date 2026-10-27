module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0001',
        username: 'host1',
        password_hash: 'dummy_hash', // Added password_hash
        full_name: 'First Host',
        email: 'host1@reachforthestars.test',
        role: 'HOST',
        created_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0001' }, {});
  },
};