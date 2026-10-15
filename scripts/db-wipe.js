// Empties the database completely: every table, and the two lists that
// remember which migrations and seeders have run. Used by "npm run db:reset".
// It works while the API is running, and whatever rows the API has created.
const { sequelize } = require('../src/models');
const env = require('../src/config/env');

async function main() {
  if (env.nodeEnv === 'production') {
    throw new Error('db:reset is for development only.');
  }
  await sequelize.query('DROP SCHEMA public CASCADE');
  await sequelize.query('CREATE SCHEMA public');
  console.log(`Database ${env.db.name} is empty.`);
  await sequelize.close();
}

main().catch((error) => {
  console.error('DB WIPE FAILED:', error.message);
  process.exit(1);
});
