// Model = the JavaScript view of ONE table. Column rules live in the migration;
// the model only tells Sequelize how to read and write the table.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'User',
    {
      user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      school_id: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      full_name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'PLAYER' },
    },
    { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );
