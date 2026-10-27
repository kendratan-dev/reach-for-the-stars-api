// Runs after the validation rules of a route. If any rule failed, the request
// stops here with 400 and never reaches the controller.
const { validationResult } = require('express-validator');
const { badRequest } = require('../errors/app-error');

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((problem) => ({ field: problem.path || 'body', message: problem.msg }));
  throw badRequest('VALIDATION_FAILED', details[0].message, details);
}

module.exports = validate;
