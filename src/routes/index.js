const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

router.use(currentUser);

// Mount Module 1 (Question Sets)
router.use('/question-sets', require('./question-set.routes'));

// Mount Module 2 (Sessions)
router.use('/sessions', require('./session.routes'));

module.exports = router;