// Guards a route.
//   requireUser()                 any known account
//   requireUser('HOST', 'ADMIN')  only these roles
const { unauthorized, forbidden } = require('../errors/app-error');

function requireUser(...roles) {
  return function guard(req, res, next) {
    if (!req.user) throw unauthorized();
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      throw forbidden(`Only these roles may do this: ${roles.join(', ')}.`);
    }
    next();
  };
}

module.exports = requireUser;
