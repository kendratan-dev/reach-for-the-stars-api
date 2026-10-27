module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Session',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      host_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      join_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'WAITING',
      },
      duration_sec: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ends_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'sessions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );