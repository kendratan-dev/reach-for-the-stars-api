// The single place that maps URLs to route files.
const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Identify who is calling (Week 11 header middleware)
router.use(currentUser);

// Hub Contract endpoints
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

// Week 11 Modules
router.use('/question-sets', require('./question-set.routes'));
router.use('/sessions', require('./session.routes'));

module.exports = router;