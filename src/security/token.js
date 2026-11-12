// Login tokens: JSON Web Tokens signed with HS256 and JWT_SECRET.
// The payload says WHO (sub) and WHAT ROLE. It is signed, not encrypted:
// anyone can read it, nobody can change it without the secret.
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function issue(user) {
  return jwt.sign(
    { sub: String(user.user_id), role: user.role },
    env.jwt.secret,
    { algorithm: 'HS256', expiresIn: env.jwt.expiresIn }
  );
}

// Returns the payload, or throws when the token is forged, damaged or expired.
function verify(token) {
  return jwt.verify(token, env.jwt.secret, { algorithms: ['HS256'] });
}

module.exports = { issue, verify };
