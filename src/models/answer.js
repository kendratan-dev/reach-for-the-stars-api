module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Answer',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      player_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      choice_id: { type: DataTypes.INTEGER, allowNull: true },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false },
      answer_time_ms: { type: DataTypes.INTEGER, allowNull: false },
      stars_earned: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      streak_after: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      double_star_used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      protection_used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      tableName: 'answers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );