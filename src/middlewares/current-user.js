// TEMPORARY - Week 11 only.
// Login is built in Week 12. Until then the caller says who they are in a header:
//     X-Demo-User: 2099-0001
// Anyone can type any ID, so this is NOT security. It only lets us build and
// test endpoints before login exists. Week 12 replaces the inside of this file
// with a real token check. Controllers and services read req.user and stay the same.
const env = require('../config/env');
const userRepository = require('../repositories/user.repository');

if (env.nodeEnv === 'production') {
  throw new Error('current-user.js is the Week 11 stand-in. Replace it before production.');
}

async function currentUser(req, res, next) {
  const schoolId = req.get('X-Demo-User');
  const user = schoolId ? await userRepository.findBySchoolId(schoolId) : null;

  // Only what the rest of the code needs. Never the whole account.
  req.user = user ? { user_id: user.user_id, school_id: user.school_id, role: user.role } : null;
  next();
}

module.exports = currentUser;
