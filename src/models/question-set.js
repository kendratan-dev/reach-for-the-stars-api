module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      set_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      host_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      subject: { type: DataTypes.STRING(100), allowNull: true },
      grade_level: { type: DataTypes.STRING(50), allowNull: true },
    },
    {
      tableName: 'question_sets',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );