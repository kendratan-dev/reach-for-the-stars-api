// Runs ONCE before all tests. Jest sets NODE_ENV=test, so src/config/env.js picks
// the test database (<DB_NAME>_test): your own data is never touched.
// The test database is rebuilt from the migrations and the seed data every run,
// so every test run starts from the same, known rows.
const { execSync } = require('child_process');

module.exports = async () => {
  const run = (command) => execSync(command, { stdio: 'pipe', env: { ...process.env, NODE_ENV: 'test' } });
  try {
    run('npx sequelize-cli db:create');
  } catch {
    // The test database exists already. That is fine.
  }
  run('node scripts/db-wipe.js');
  run('npx sequelize-cli db:migrate');
  run('npx sequelize-cli db:seed:all');
};
