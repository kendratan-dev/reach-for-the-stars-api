// Database settings for BOTH the running API and sequelize-cli.
// Values come from .env - nothing secret is written in this file.
const env = require('./env');

const sslOptions = env.dbSsl
  ? {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
  : {};

const baseSettings = env.databaseUrl
  ? {
      use_env_variable: 'DATABASE_URL',
      url: env.databaseUrl,
      dialect: 'postgres',
      logging: false,
      seederStorage: 'sequelize',
      pool: { max: 10, min: 0, idle: 10000 },
      ...sslOptions,
    }
  : {
      username: env.db.user,
      password: env.db.password,
      database: env.db.name,
      host: env.db.host,
      port: env.db.port,
      dialect: 'postgres',
      logging: false,
      seederStorage: 'sequelize',
      pool: { max: 10, min: 0, idle: 10000 },
      ...sslOptions,
    };

module.exports = {
  development: baseSettings,
  test: {
    ...baseSettings,
    ...(env.databaseUrl ? {} : { database: `${process.env.DB_NAME}_test` }),
  },
  production: baseSettings,
};
