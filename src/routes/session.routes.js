const { Router } = require('express');
const controller = require('../controllers/session.controller');
const rules = require('../validators/session.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Host: Create Session
router.post(
  '/',
  requireUser('HOST', 'ADMIN'),
  rules.createRules,
  validate,
  controller.create
);

// Player: Join or Rejoin Session by Code
router.post(
  '/:code/players',
  requireUser('PLAYER', 'HOST', 'ADMIN'),
  rules.joinRules,
  validate,
  controller.join
);

// Host: Update Session Status (e.g. LOBBY -> RUNNING -> CLOSED)
router.patch(
  '/:code',
  requireUser('HOST', 'ADMIN'),
  controller.updateStatus
);

// Shared: Get Session Info
router.get(
  '/:id',
  requireUser('HOST', 'ADMIN', 'PLAYER'),
  rules.idParam,
  validate,
  controller.get
);

module.exports = router;