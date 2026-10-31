module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      host_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT },
      subject: { type: DataTypes.STRING(100) },
      grade_level: { type: DataTypes.STRING(50) },
    },
    { tableName: 'question_sets', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );