const express = require('express');
const router = express.Router({ mergeParams: true });
const questionController = require('../controllers/question.controller');

// Routes mounted at /api/v1/question-sets/:setId/questions
router.get('/', questionController.listBySet);
router.post('/', questionController.create);
router.delete('/:id', questionController.remove);

module.exports = router;