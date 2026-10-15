const { Router } = require('express');
const healthController = require('../controllers/health.controller');

const router = Router();

router.get('/', healthController.getHealth);

module.exports = router;
