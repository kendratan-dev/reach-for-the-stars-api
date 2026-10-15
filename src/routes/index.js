// The single place that maps URLs to route files.
const { Router } = require('express');

const router = Router();

// Hub Contract endpoints
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

module.exports = router;
