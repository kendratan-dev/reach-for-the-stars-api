jest.mock('../../src/repositories/question.repository');
jest.mock('../../src/repositories/question-set.repository');
const questionRepository = require('../../src/repositories/question.repository');
const questionSetRepository = require('../../src/repositories/question-set.repository');
const questionService = require('../../src/services/question.service');

describe('question.service unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('throws 409 SET_IN_USE when editing a question set already used in a session', async () => {
    questionSetRepository.findById.mockResolvedValue({ id: 1, host_id: 2 });
    questionSetRepository.isUsedInSession.mockResolvedValue(true);

    await expect(
      questionService.createQuestion(1, { text: 'Sample?', choices: [] }, { user_id: 2, role: 'HOST' })
    ).rejects.toMatchObject({ status: 409, code: 'SET_IN_USE' });

    expect(questionRepository.createWithChoices).not.toHaveBeenCalled();
  });
});
