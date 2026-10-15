const { Router } = require('express');
const gameInfoController = require('../controllers/game-info.controller');

const router = Router();

router.get('/', gameInfoController.getGameInfo);

module.exports = router;
