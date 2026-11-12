// Week 16: writes docs/data-dictionary.md from the REAL database, so the
// dictionary always matches the migrations.  npm run docs:dictionary
// Run "npm run db:migrate" first. Then replace every [Your description] by hand.
// Descriptions you already wrote are kept: the script reads the old file first.
const fs = require('fs');
const path = require('path');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../src/models');

const OUT = path.join(__dirname, '..', 'docs', 'data-dictionary.md');
const q = (sql) => sequelize.query(sql, { type: QueryTypes.SELECT });

// "| table.column | ... | description |" lines of the old file, by table.column.
function oldDescriptions() {
  if (!fs.existsSync(OUT)) return {};
  const found = {};
  let table = null;
  for (const line of fs.readFileSync(OUT, 'utf8').split('\n')) {
    const heading = line.match(/^### `(\w+)`/);
    if (heading) table = heading[1];
    const cells = line.split('|').map((c) => c.trim());
    if (table && cells.length > 7 && cells[1].startsWith('`')) found[`${table}.${cells[1].replace(/`/g, '')}`] = cells[cells.length - 2];
  }
  return found;
}

async function main() {
  const keep = oldDescriptions();
  const tables = (await q(`SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public'
    AND tablename NOT IN ('SequelizeMeta', 'SequelizeData') ORDER BY tablename`)).map((t) => t.name);
  const lines = ['# Data dictionary', '', `Generated from the database by \`npm run docs:dictionary\` on ${new Date().toISOString().slice(0, 10)}, then described by hand.`, ''];
  for (const table of tables) {
    const cols = await q(`SELECT column_name, data_type, character_maximum_length AS len, is_nullable, column_default
      FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}' ORDER BY ordinal_position`);
    const cons = await q(`SELECT c.conname, c.contype, pg_get_constraintdef(c.oid) AS def, a.attname AS col
      FROM pg_constraint c JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
      WHERE c.conrelid = '${table}'::regclass`);
    lines.push(`### \`${table}\``, '', '| Column | Type | Null | Default | Keys and rules | Description |', '|---|---|---|---|---|---|');
    for (const col of cols) {
      const type = col.len ? `${col.data_type}(${col.len})` : col.data_type;
      const rules = cons.filter((c) => c.col === col.column_name)
        .map((c) => ({ p: 'PK', f: `FK ${c.def.replace(/^FOREIGN KEY \(\w+\) /, '')}`, u: `UNIQUE (${c.conname})`, c: `CHECK (${c.conname})` }[c.contype]))
        .join('; ');
      const description = keep[`${table}.${col.column_name}`] || '[Your description]';
      let def = col.column_default || '';
      if (def.startsWith('nextval(')) def = 'auto number';
      else if (def) def = `\`${def.replace(/::[\w ]+/g, '').replace(/\|/g, '/')}\``;
      lines.push(`| \`${col.column_name}\` | ${type} | ${col.is_nullable === 'YES' ? 'yes' : 'no'} | ${def} | ${rules} | ${description} |`);
    }
    lines.push('');
  }
  fs.writeFileSync(OUT, `${lines.join('\n')}\n`);
  console.log(`Wrote ${OUT}: ${tables.length} tables.`);
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(() => sequelize.close());
