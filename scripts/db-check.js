// Counts the rows in every table of your database.
// Run with:  npm run db:check
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../src/models');

async function main() {
  const tables = await sequelize.query(
    `SELECT tablename AS name FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('SequelizeMeta', 'SequelizeData')
      ORDER BY tablename`,
    { type: QueryTypes.SELECT }
  );

  const rows = [];
  for (const { name: table } of tables) {
    const [result] = await sequelize.query(`SELECT COUNT(*)::int AS count FROM "${table}"`, {
      type: QueryTypes.SELECT,
    });
    rows.push({ table, rows: result.count });
  }
  console.table(rows);

  const total = rows.reduce((sum, row) => sum + row.rows, 0);
  const empty = rows.filter((row) => row.rows === 0).map((row) => row.table);
  console.log(`${rows.length} tables, ${total} rows in total.`);

  if (rows.length === 0) {
    console.log('No tables yet. Run: npm run db:migrate');
  } else if (empty.length > 0) {
    console.log(`Tables with no rows yet: ${empty.join(', ')}`);
  } else {
    console.log('Every table has rows.');
  }
  await sequelize.close();
}

main().catch((error) => {
  console.error('DB CHECK FAILED:', error.message);
  process.exit(1);
});
