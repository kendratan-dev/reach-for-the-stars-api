module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    const demoUser = req.headers['x-demo-user'];

    if (!demoUser) {
      return res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Say who you are first: send the X-Demo-User header.'
        }
      });
    }

    // Map student numbers to distinct user IDs & roles
    let userId = 1;
    let role = 'HOST';

    if (demoUser === '2099-0001') { userId = 1; role = 'HOST'; }
    if (demoUser === '2099-0002') { userId = 2; role = 'PLAYER'; } // <--- PLAYER ROLE
    if (demoUser === '2099-0003') { userId = 3; role = 'HOST'; }
    if (demoUser === '2099-0004') { userId = 4; role = 'PLAYER'; }
    if (demoUser === '2099-0005') { userId = 5; role = 'PLAYER'; }

    // Check allowed roles if specified in the route line
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You are not allowed to do that.'
        }
      });
    }

    req.user = {
      user_id: userId,
      host_id: userId,
      role: role,
      student_number: demoUser
    };

    next();
  };
};