// Week 14: the first ADMIN account on a server that has no seed data.
// On Render it runs on every start (see "start:render" in package.json) and does
// nothing once the account exists. It reads two settings you type in the Render
// dashboard, never in a file:  ADMIN_SCHOOL_ID  and  ADMIN_PASSWORD.
const { User, sequelize } = require('../src/models');
const password = require('../src/security/password');

async function main() {
  const schoolId = process.env.ADMIN_SCHOOL_ID;
  const plain = process.env.ADMIN_PASSWORD;
  if (!schoolId || !plain) {
    console.log('create-admin: ADMIN_SCHOOL_ID or ADMIN_PASSWORD is not set. Skipped.');
    return;
  }
  if (plain.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters long.');
  const [, created] = await User.findOrCreate({
    where: { school_id: schoolId },
    defaults: {
      full_name: 'Library Administrator',
      email: `${schoolId}@admin.invalid`,
      role: 'ADMIN',
      password_hash: await password.hash(plain),
    },
  });
  console.log(created ? `create-admin: created ADMIN ${schoolId}.` : `create-admin: ${schoolId} already exists.`);
}

main()
  .catch((error) => {
    console.error('create-admin failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
