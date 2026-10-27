const { Router } = require('express');
const questionSetRoutes = require('./question-set.routes');
const sessionRoutes = require('./session.routes');

const router = Router();

router.use('/question-sets', questionSetRoutes);
router.use('/sessions', sessionRoutes);

module.exports = router;