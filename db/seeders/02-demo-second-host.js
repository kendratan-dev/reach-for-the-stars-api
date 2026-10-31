module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '2026-0001',
        username: 'host1',
        password_hash: 'dummy_hash',
        full_name: 'First Host',
        email: 'host1@reachforthestars.test',
        role: 'HOST',
        created_at: new Date(),
      },
      {
        school_id: '2026-0002',
        username: 'host2',
        password_hash: 'dummy_hash',
        full_name: 'Second Host',
        email: 'host2@reachforthestars.test',
        role: 'HOST',
        created_at: new Date(),
      },
      {
        school_id: '2026-0003',
        username: 'player1',
        password_hash: 'dummy_hash',
        full_name: 'First Player',
        email: 'player1@reachforthestars.test',
        role: 'PLAYER',
        created_at: new Date(),
      },
    ], { ignoreDuplicates: true });
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: ['2026-0001', '2026-0002', '2026-0003'] }, {});
  },
};