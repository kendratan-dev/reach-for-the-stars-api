// Week 12: who is calling, from the login token.
//     Authorization: Bearer <token from POST /auth/login>
// No header        -> req.user = null (requireUser answers 401 where a login is needed)
// A bad token      -> 401 INVALID_TOKEN, always (forged, damaged or expired)
// A good token     -> req.user = { user_id, school_id, role } read FRESH from the database,
//                     so a changed role or a removed account counts at once.
// Controllers and services still read only req.user: nothing else changed this week.
const token = require('../security/token');
const userRepository = require('../repositories/user.repository');
const { unauthorized } = require('../errors/app-error');

async function currentUser(req, res, next) {
  const header = req.get('Authorization');
  if (!header) {
    req.user = null;
    return next();
  }

  const [scheme, value] = header.split(' ');
  if (scheme !== 'Bearer' || !value) {
    throw unauthorized('Send the header as: Authorization: Bearer <token>.', 'INVALID_TOKEN');
  }

  let payload;
  try {
    payload = token.verify(value);
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'Your login has expired. Log in again.'
      : 'This token is not valid. Log in again.';
    throw unauthorized(message, 'INVALID_TOKEN');
  }

  const account = await userRepository.findById(Number(payload.sub));
  if (!account) throw unauthorized('This account no longer exists.', 'INVALID_TOKEN');

  req.account = account;                 // the full account, for GET /auth/me
  req.user = { user_id: account.user_id, school_id: account.school_id, role: account.role };
  return next();
}

module.exports = currentUser;
