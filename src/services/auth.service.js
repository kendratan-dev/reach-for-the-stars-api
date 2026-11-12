const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../config/env');
const AppError = require('../utils/app-error');

async function register(data) {
  const { password, ...rest } = data;
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Create the user with the hashed password
  const user = await User.create({
    ...rest,
    password_hash,
  });

  return user;
}

async function login(school_id, password) {
  // Find user by school_id
  const user = await User.findOne({ where: { school_id } });
  if (!user || !user.password_hash) {
    throw new AppError('Invalid school ID or password', 401, 'INVALID_CREDENTIALS');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid school ID or password', 401, 'INVALID_CREDENTIALS');
  }

  // Generate JWT token
  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN || '1h' }
  );

  return {
    token,
    user: toJson(user),
  };
}

function toJson(user) {
  const json = user.toJSON ? user.toJSON() : { ...user };
  delete json.password_hash;
  return json;
}

module.exports = {
  register,
  login,
  toJson,
};