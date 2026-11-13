jest.mock('../../src/repositories/user.repository');
const userRepository = require('../../src/repositories/user.repository');
const authService = require('../../src/services/auth.service');

describe('auth.service unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register forces PLAYER role and hashes password', async () => {
    userRepository.create.mockImplementation(async (payload) => ({
      user_id: 99,
      ...payload,
    }));

    const created = await authService.register({
      school_id: '2026-8888',
      full_name: 'Unit Tester',
      email: 'unit@test.edu',
      password: 'StrongPassword1!',
      role: 'ADMIN',
    });

    expect(created.role).toBe('PLAYER');
    expect(created.password_hash).toMatch(/^\$2[aby]\$/);
  });

  test('unknown school_id and wrong password throw the exact same 401 error', async () => {
    userRepository.findForLogin.mockResolvedValueOnce(null);

    let unknownErr;
    try {
      await authService.login('2026-0000-unknown', 'Pass1234!');
    } catch (err) {
      unknownErr = err;
    }

    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('CorrectPass1!', 4);
    userRepository.findForLogin.mockResolvedValueOnce({
      user_id: 1,
      school_id: '2026-0001',
      role: 'PLAYER',
      password_hash: hash,
    });

    let wrongPassErr;
    try {
      await authService.login('2026-0001', 'WrongPass9!');
    } catch (err) {
      wrongPassErr = err;
    }

    expect(unknownErr.statusCode).toBe(401);
    expect(wrongPassErr.statusCode).toBe(401);
    expect(unknownErr.code).toBe(wrongPassErr.code);
    expect(unknownErr.message).toBe(wrongPassErr.message);
  });
});
