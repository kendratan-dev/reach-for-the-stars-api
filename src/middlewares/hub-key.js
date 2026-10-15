// Only the Library Game Hub may read results: it sends the key in a header.
//     X-Hub-Key: <the value of HUB_API_KEY in .env>
// XP is exchanged for real library services, so results are never public.
const crypto = require('crypto');
const env = require('../config/env');

function sameText(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function hubKey(req, res, next) {
  const sent = req.get('X-Hub-Key');
  if (!sent || !sameText(sent, env.hubApiKey)) {
    return res.status(401).json({
      error: { code: 'HUB_KEY_REQUIRED', message: 'Send the library key in the X-Hub-Key header.' },
    });
  }
  next();
}

module.exports = hubKey;
