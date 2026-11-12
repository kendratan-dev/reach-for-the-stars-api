const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Public authentication routes (login, register)
router.use('/auth', require('./auth.routes'));

// From here on, req.user is set via JWT token verification
router.use(currentUser);

// Admin user management routes
router.use('/users', require('./user.routes'));

// Mount Module 1 (Question Sets)
router.use('/question-sets', require('./question-set.routes'));

// Mount Module 2 (Sessions)
router.use('/sessions', require('./session.routes'));

module.exports = router;