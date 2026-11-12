const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Parse Bearer token on all routes (sets req.user = null if no header)
router.use(currentUser);

// Auth routes (/register and /login are public; /me uses requireUser())
router.use('/auth', require('./auth.routes'));

// Admin user management routes
router.use('/users', require('./user.routes'));

// Mount Module 1 (Question Sets)
router.use('/question-sets', require('./question-set.routes'));

// Mount Module 2 (Sessions)
router.use('/sessions', require('./session.routes'));

module.exports = router;