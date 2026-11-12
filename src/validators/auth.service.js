const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const { unauthorized, conflict } = require('../errors/app-error');

async function register(data) {
  const existing = await User.findOne({ where: { school_id: data.school_id } });
  if (existing) {
    throw conflict('SCHOOL_ID_TAKEN', 'That school ID is already registered.');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(data.password, salt);

  const user = await User.create({
    school_id: data.school_id,
    full_name: data.full_name,
    email: data.email,
    password_hash,
    role: 'PLAYER', // Always created as PLAYER
  });

  return user;
}

async function login(school_id, password) {
  const user = await User.findOne({ where: { school_id } });
  
  // Dummy comparison to prevent timing attacks if user doesn't exist
  const validHash = user ? user.password_hash : '$2a$10$DUMMYHASHFORTIMINGATTACKMITIGATION1234567890';
  const match = await bcrypt.compare(password, validHash);

  if (!user || !match || !user.password_hash) {
    throw unauthorized('INVALID_CREDENTIALS', 'Invalid school ID or password.');
  }

  const token = jwt.sign(
    { user_id: user.user_id, school_id: user.school_id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn || '1h' }
  );

  return {
    token,
    token_type: 'Bearer',
    expires_in: 3600,
    user: toJson(user),
  };
}

function toJson(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

module.exports = {
  register,
  login,
  toJson,
};