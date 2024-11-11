'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  if(!process.env.SCHEMA){
    throw new Error('SCHEMA environment variable not defined');
  } else options.schema = process.env.SCHEMA;
};


module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.addColumn(options, 'firstName', {
      type: Sequelize.STRING(30),
      allowNull: false,
      validate: { len: [1, 30] }
    });
    
    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING(30),
      allowNull: false,
      validate: { len: [1, 30] }
    });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName');
  }
};
