const { Router } = require('express');
const controller = require('../controllers/question-set.controller');
const rules = require('../validators/question-set.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');
const questionRouter = require('./question.routes');

const router = Router();

router.use(requireUser('HOST', 'ADMIN'));

// Question Sets Base Routes
router.get('/', controller.list);
router.post('/', rules.createRules, validate, controller.create);
router.get('/:id', rules.idParam, validate, controller.get);
router.patch('/:id', rules.updateRules, validate, controller.update);
router.delete('/:id', rules.idParam, validate, controller.remove);

// Mount Nested Question Routes: /api/v1/question-sets/:setId/questions
router.use('/:setId/questions', questionRouter);

module.exports = router;