const bcrypt = require('bcryptjs');
const tokenHelper = require('../security/token');
const userRepository = require('../repositories/user.repository');
const env = require('../config/env');
const AppError = require('../utils/app-error');

const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

async function register(data) {
  const { password, ...rest } = data;

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await userRepository.create({
    ...rest,
    username: rest.username || rest.school_id,
    role: 'PLAYER',
    password_hash,
  });

  return user;
}

async function login(school_id, password) {
  const user = await userRepository.findForLogin(school_id);
  const hashToCompare = user && user.password_hash ? user.password_hash : DUMMY_HASH;

  const isMatch = await bcrypt.compare(password, hashToCompare);
  if (!user || !user.password_hash || !isMatch) {
    throw new AppError('Invalid school ID or password', 401, 'INVALID_CREDENTIALS');
  }

  const token = tokenHelper.issue(user);

  return {
    token,
    token_type: 'Bearer',
    expires_in: env.jwt.expiresIn,
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