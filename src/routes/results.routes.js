// Hub Contract rule 7: the Library Game Hub reads finished games here.
const { Router } = require('express');
const hubKey = require('../middlewares/hub-key');
const controller = require('../controllers/results.controller');

const router = Router();

router.get('/', hubKey, controller.getResults);

module.exports = router;
