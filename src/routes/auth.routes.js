const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const rules = require('../validators/auth.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

router.post('/register', rules.registerRules, validate, authController.register);
router.post('/login', rules.loginRules, validate, authController.login);
router.get('/me', requireUser(), authController.me);

module.exports = router;