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

    // Map student numbers to distinct user IDs
    let userId = 1;
    if (demoUser === '2099-0002') userId = 2;
    if (demoUser === '2099-0004') userId = 4;

    req.user = {
      user_id: userId,
      host_id: userId,
      role: 'HOST',
      student_number: demoUser
    };

    next();
  };
};