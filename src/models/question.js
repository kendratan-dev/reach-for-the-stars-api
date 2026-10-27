module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Question',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      time_limit_sec: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
    },
    {
      tableName: 'questions',
      timestamps: false,
    }
  );