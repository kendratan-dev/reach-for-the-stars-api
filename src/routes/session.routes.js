const { Router } = require('express');
const controller = require('../controllers/session.controller');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Code lookup and player join endpoints (no host auth required)
router.get('/by-code/:code', controller.getByCode);
router.post('/join', controller.join);

// Host-protected session endpoints
router.use(requireUser('HOST', 'ADMIN'));

router.post('/', controller.create);
router.get('/:id', controller.getById);
router.patch('/:id/start', controller.start);
router.patch('/:id/end', controller.end);

module.exports = router;