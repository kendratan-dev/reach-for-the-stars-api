const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const Choice = require('./choice')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const SessionPlayer = require('./session-player')(sequelize, DataTypes);
const Answer = require('./answer')(sequelize, DataTypes);

User.hasMany(QuestionSet, { foreignKey: 'host_id' });
QuestionSet.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

QuestionSet.hasMany(Question, { foreignKey: 'question_set_id', as: 'questions' });
Question.belongsTo(QuestionSet, { foreignKey: 'question_set_id', as: 'questionSet' });

Question.hasMany(Choice, { foreignKey: 'question_id', as: 'choices' });
Choice.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

User.hasMany(Session, { foreignKey: 'host_id' });
Session.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

QuestionSet.hasMany(Session, { foreignKey: 'question_set_id' });
Session.belongsTo(QuestionSet, { foreignKey: 'question_set_id' });

Session.hasMany(SessionPlayer, { foreignKey: 'session_id' });
SessionPlayer.belongsTo(Session, { foreignKey: 'session_id' });

User.hasMany(SessionPlayer, { foreignKey: 'user_id' });
SessionPlayer.belongsTo(User, { foreignKey: 'user_id' });

SessionPlayer.hasMany(Answer, { foreignKey: 'player_id' });
Answer.belongsTo(SessionPlayer, { foreignKey: 'player_id' });

Question.hasMany(Answer, { foreignKey: 'question_id' });
Answer.belongsTo(Question, { foreignKey: 'question_id' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  Question,
  Choice,
  Session,
  SessionPlayer,
  Answer,
};