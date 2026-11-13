module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'SessionPlayer',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: true },
      nickname: { type: DataTypes.STRING(50), allowNull: false },
      stars: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      correct_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      answer_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      total_answer_ms: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
      joined_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'session_players',
      timestamps: false,
    }
  );