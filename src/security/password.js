// Password hashing with bcrypt (the bcryptjs package: pure JavaScript, no compiler needed).
// hash()   : password -> "$2b$10$..." (a new random salt every time)
// matches(): password + stored hash -> true or false
const bcrypt = require('bcryptjs');
const env = require('../config/env');

function hash(password) {
  return bcrypt.hash(password, env.bcryptRounds);   // rounds = cost factor: 10 means 2^10 rounds
}

// A hash of a random string. Comparing against it when the account does not exist
// takes as long as a real comparison, so the response time does not reveal
// which school IDs have accounts.
const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8.Ii4yWnZb1wB6bS2yGmV5r7Qe4W1a';

async function matches(password, passwordHash) {
  const ok = await bcrypt.compare(password, passwordHash || DUMMY_HASH);
  return Boolean(passwordHash) && ok;     // an account with no password can never log in
}

module.exports = { hash, matches };
