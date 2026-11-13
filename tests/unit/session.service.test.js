jest.mock('../../src/repositories/session.repository');
jest.mock('../../src/models', () => ({
  sequelize: { transaction: jest.fn() },
  Question: { findOne: jest.fn(), count: jest.fn() },
  Choice: { findOne: jest.fn() },
  SessionPlayer: { findOne: jest.fn(), findAll: jest.fn() },
  Answer: { create: jest.fn() },
}));

const sessionRepository = require('../../src/repositories/session.repository');
const { SessionPlayer, Answer } = require('../../src/models');
const sessionService = require('../../src/services/session.service');

describe('session.service unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('refuses answer with 403 when caller is not seated and never records an answer', async () => {
    sessionRepository.findByCode.mockResolvedValue({
      id: 10,
      join_code: '123456',
      status: 'RUNNING',
      question_set_id: 1,
      current_position: 1,
    });
    SessionPlayer.findOne.mockResolvedValue(null);

    await expect(
      sessionService.submitAnswer('123456', { question_id: 1, choice_id: 1 }, { user_id: 42 })
    ).rejects.toMatchObject({ status: 403 });

    expect(Answer.create).not.toHaveBeenCalled();
  });
});
