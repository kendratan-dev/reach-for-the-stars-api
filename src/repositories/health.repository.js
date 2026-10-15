// The only layer that talks to the database.
// Week 7 showed a repository holding raw SQL. With Sequelize, a repository
// calls the models (or the shared connection) instead. It is still the
// only door to the data: services call repositories, never the database.
const { sequelize } = require('../models');

async function ping() {
  await sequelize.authenticate();
}

module.exports = { ping };
