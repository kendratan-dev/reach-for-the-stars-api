const { execSync } = require('child_process');
const { Client } = require('pg');
require('dotenv').config({ quiet: true });

module.exports = async () => {
  process.env.NODE_ENV = 'test';
  const baseDb = process.env.DB_NAME || 'reach_for_the_stars';
  const testDb = `${baseDb}_test`;

  const adminClient = new Client({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  await adminClient.connect();
  const res = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [testDb]);
  if (res.rowCount === 0) {
    await adminClient.query(`CREATE DATABASE "${testDb}"`);
  }
  await adminClient.end();

  const testClient = new Client({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: testDb,
  });
  await testClient.connect();
  await testClient.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await testClient.end();

  const env = { ...process.env, NODE_ENV: 'test' };
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit', env });
  execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit', env });
};
