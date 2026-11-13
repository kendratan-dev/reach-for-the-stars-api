const { sequelize, Question, Choice, SessionPlayer, Answer } = require('../models');
const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { pointsFor } = require('./scoring');
const { notFound, forbidden, conflict, badRequest } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No session found with join code ${code}.`);
  }
  return session;
}

async function create(questionSetId, user) {
  const questionSet = await questionSetRepository.findById(questionSetId);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${questionSetId}.`);
  }

  const mayUse = questionSet.host_id === user.user_id || questionSet.is_public || user.role === 'ADMIN';
  if (!mayUse) {
    throw forbidden('This question set belongs to another host.');
  }

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await sessionRepository.create({
        question_set_id: questionSet.id,
        host_id: user.user_id,
        join_code: randomCode(),
        duration_sec: 60,
        status: 'LOBBY',
      });
    } catch (error) {
      if (constraintOf(error) !== 'sessions_join_code_key' && constraintOf(error) !== 'game_sessions_join_pin_key') {
        throw error;
      }
    }
  }
  throw new Error('Could not find a free join code after 5 attempts.');
}

async function getSessionByCode(code) {
  return await findOrFail(code);
}

async function patchSession(code, payload, user) {
  const session = await findOrFail(code);

  if (session.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This game belongs to another host.');
  }

  const { status, current_position } = payload;
  const changes = {};

  if (status !== undefined) {
    if (session.status === status) {
      throw conflict('INVALID_STATUS_CHANGE', `Session is already in ${status} status.`);
    }

    const NEXT_STATUS = {
      LOBBY: ['RUNNING', 'CLOSED'],
      RUNNING: ['CLOSED'],
      CLOSED: [],
    };

    if (!NEXT_STATUS[session.status] || !NEXT_STATUS[session.status].includes(status)) {
      throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
    }

    changes.status = status;
    if (status === 'RUNNING') {
      const now = new Date();
      changes.started_at = now;
      changes.current_position = 1;
      changes.question_started_at = now;
    }
    if (status === 'CLOSED') {
      changes.ended_at = new Date();
    }
  }

  if (current_position !== undefined && status !== 'RUNNING') {
    if (session.status !== 'RUNNING') {
      throw conflict('SESSION_NOT_RUNNING', 'Can only advance questions while the game is RUNNING.');
    }

    const totalQuestions = await Question.count({
      where: { question_set_id: session.question_set_id },
    });

    const expectedNext = (session.current_position || 0) + 1;
    if (expectedNext > totalQuestions) {
      throw conflict('NO_MORE_QUESTIONS', 'No more questions remain in this question set.');
    }
    if (current_position !== expectedNext) {
      throw conflict('NOT_NEXT_QUESTION', `Expected next question position ${expectedNext}, received ${current_position}.`);
    }

    changes.current_position = current_position;
    changes.question_started_at = new Date();
  }

  return await sessionRepository.update(session, changes);
}

async function getCurrentQuestion(code) {
  const session = await findOrFail(code);

  if (session.status !== 'RUNNING' || !session.current_position) {
    throw conflict('SESSION_NOT_RUNNING', 'No active question because the session is not RUNNING.');
  }

  const question = await Question.findOne({
    where: {
      question_set_id: session.question_set_id,
      position: session.current_position,
    },
    include: [
      {
        model: Choice,
        as: 'choices',
        attributes: ['id', 'text'],
      },
    ],
    order: [[{ model: Choice, as: 'choices' }, 'id', 'ASC']],
  });

  if (!question) {
    throw notFound('QUESTION_NOT_FOUND', 'Current question could not be found.');
  }

  return {
    question_id: question.id,
    position: question.position,
    text: question.text,
    type: question.type,
    time_limit_sec: question.time_limit_sec,
    points_base: question.points_base,
    question_started_at: session.question_started_at,
    choices: (question.choices || []).map((c) => ({
      id: c.id,
      text: c.text,
    })),
  };
}

async function submitAnswer(code, { question_id, choice_id }, user) {
  const session = await findOrFail(code);

  // 1. Game RUNNING (409)
  if (session.status !== 'RUNNING') {
    throw conflict('SESSION_NOT_RUNNING', 'Answers can only be submitted while the game is RUNNING.');
  }

  // 2. Caller seated in this session (403)
  const player = await SessionPlayer.findOne({
    where: { session_id: session.id, user_id: user.user_id },
  });
  if (!player) {
    throw forbidden('You are not seated in this game session.');
  }

  // 3. Current question (409)
  const currentQuestion = await Question.findOne({
    where: {
      question_set_id: session.question_set_id,
      position: session.current_position,
    },
  });
  if (!currentQuestion || currentQuestion.id !== question_id) {
    throw conflict('NOT_CURRENT_QUESTION', 'This question is not the active question for the session.');
  }

  // 4. Choice belongs to the question (400)
  const choice = await Choice.findOne({
    where: { id: choice_id, question_id: currentQuestion.id },
  });
  if (!choice) {
    throw badRequest('Choice does not belong to the current question.');
  }

  const startedAt = session.question_started_at ? new Date(session.question_started_at).getTime() : Date.now();
  const elapsedMs = Math.max(0, Date.now() - startedAt);
  const isCorrect = Boolean(choice.is_correct);
  const points = pointsFor(currentQuestion, isCorrect, elapsedMs);

  try {
    return await sequelize.transaction(async (transaction) => {
      const answer = await Answer.create(
        {
          player_id: player.id,
          question_id: currentQuestion.id,
          choice_id: choice.id,
          is_correct: isCorrect,
          answer_time_ms: elapsedMs,
          stars_earned: points,
        },
        { transaction }
      );

      if (points > 0) {
        await player.increment('stars', { by: points, transaction });
      }
      await player.increment('answer_count', { by: 1, transaction });
      if (isCorrect) {
        await player.increment('correct_count', { by: 1, transaction });
      }

      await player.reload({ transaction });

      return {
        answer_id: answer.id,
        question_id: currentQuestion.id,
        choice_id: choice.id,
        is_correct: isCorrect,
        points_earned: points,
        total_score: player.stars,
      };
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError' || constraintOf(error) === 'uq_answer_player_question') {
      throw conflict('ALREADY_ANSWERED', 'You have already answered this question.');
    }
    throw error;
  }
}

async function getLeaderboard(code, limit = 10) {
  const session = await findOrFail(code);
  const players = await SessionPlayer.findAll({
    where: { session_id: session.id },
    order: [
      ['stars', 'DESC'],
      ['id', 'ASC'],
    ],
  });

  // Dense/competition tie ranking: 1, 2, 2, 4
  let lastScore = null;
  let lastRank = 0;
  const ranked = players.map((p, index) => {
    const score = Number(p.stars || 0);
    const rank = score === lastScore ? lastRank : index + 1;
    lastScore = score;
    lastRank = rank;
    return {
      rank,
      player_id: p.id,
      nickname: p.nickname,
      score,
      completed: Number(p.answer_count || 0) > 0,
    };
  });

  return {
    code: session.join_code,
    status: session.status,
    leaderboard: ranked.slice(0, limit),
  };
}

module.exports = {
  create,
  createSession: create,
  getSessionByCode,
  patchSession,
  changeStatus: (code, status, user) => patchSession(code, { status }, user),
  getCurrentQuestion,
  submitAnswer,
  getLeaderboard,
  findOrFail,
};
