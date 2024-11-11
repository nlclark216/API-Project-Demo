'use strict';

const { Op } = require('sequelize');
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

const users = [
  {
    firstName: 'Chadwick',
    lastName: 'Boseman',
    email: 'demo@user.io',
    username: 'Demo-lition',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    firstName: 'Michelle',
    lastName: 'Obama',
    email: 'user1@user.io',
    username: 'FakeUser1',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    firstName: 'Gabrielle',
    lastName: 'Union',
    email: 'user2@user.io',
    username: 'FakeUser2',
    hashedPassword: bcrypt.hashSync('password3')
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate(users, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    for(const user of users){
      await User.destroy({
        where: {
          [Op.and]: [
            { username: user.username },
            { email: user.email }
          ]
        }
      });
    };
  }
};