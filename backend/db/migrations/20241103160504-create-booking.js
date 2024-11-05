'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  if(!process.env.SCHEMA){
    throw new Error('SCHEMA environment variable not defined');
  } else options.schema = process.env.SCHEMA;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bookings", options);
  }
};