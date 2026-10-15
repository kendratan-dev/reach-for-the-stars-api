'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chest_slots', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      chest_offer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'chest_offers', key: 'id' },
        onDelete: 'CASCADE'
      },
      slot_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reward_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chest_slots');
  }
};