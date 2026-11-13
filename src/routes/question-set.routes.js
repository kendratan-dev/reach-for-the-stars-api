const { Router } = require('express');
const controller = require('../controllers/question-set.controller');
const rules = require('../validators/question-set.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');
const uploadCover = require('../middlewares/upload-cover');
const questionRoutes = require('./question.routes');

const router = Router();

// Guard all endpoints in this module for HOST and ADMIN accounts
router.use(requireUser('HOST', 'ADMIN'));

router.get('/', rules.listRules, validate, controller.list);
router.post('/', rules.createRules, validate, controller.create);
router.get('/:id', rules.getOneRules, validate, controller.get);
router.patch('/:id', rules.updateRules, validate, controller.update);
router.delete('/:id', rules.idParam, validate, controller.remove);

// Cover image upload
router.put('/:id/cover', rules.idParam, validate, uploadCover, controller.uploadCover);

// Nested questions under /question-sets/:id/questions
router.use('/:id/questions', questionRoutes);

module.exports = router;