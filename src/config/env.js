// Loads .env once and fails fast when a required key is missing.
require('dotenv').config({ quiet: true });

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const REQUIRED = hasDatabaseUrl
  ? ['HUB_API_KEY', 'JWT_SECRET', 'CORS_ORIGINS']
  : [
      'DB_HOST',
      'DB_PORT',
      'DB_NAME',
      'DB_USER',
      'DB_PASSWORD',
      'HUB_API_KEY',
      'JWT_SECRET',
      'CORS_ORIGINS',
    ];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required .env keys: ${missing.join(', ')}. ` +
      'Copy .env.example to .env and fill in your own values.'
  );
}

const nodeEnv = process.env.NODE_ENV || 'development';
const baseDbName = process.env.DB_NAME;
const dbName = nodeEnv === 'test' && baseDbName ? `${baseDbName}_test` : baseDbName;

module.exports = {
  nodeEnv,
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  port: Number(process.env.PORT) || 3001,
  hubApiKey: process.env.HUB_API_KEY,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  corsOrigins: process.env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  databaseUrl: process.env.DATABASE_URL || null,
  dbSsl: String(process.env.DB_SSL).toLowerCase() === 'true',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: dbName,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};

