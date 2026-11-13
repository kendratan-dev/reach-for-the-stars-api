const { sequelize } = require('../../src/models');

afterAll(async () => {
  await sequelize.close();
});
