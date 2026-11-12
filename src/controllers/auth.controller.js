const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');

async function register(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const user = await authService.register(data);
  res.status(201).json({ user: authService.toJson(user) });
}

async function login(req, res) {
  const { school_id, password } = matchedData(req, { locations: ['body'] });
  const result = await authService.login(school_id, password);
  res.status(200).json(result);
}

async function me(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = {
  register,
  login,
  me,
};