'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
};


module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 2,
        spotId: 1,
        review: "This was an awesome spot!",
        stars: 5,
      },
      {
        userId: 3,
        spotId: 1,
        review: "What an amazing spot!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 2,
        review: "Really liked this spot!",
        stars: 5,
      },
      {
        userId: 3,
        spotId: 2,
        review: "Amazing spot!",
        stars: 4,
      },
      {
        userId: 1,
        spotId: 3,
        review: "What an awesome spot!",
        stars: 4,
      },
      {
        userId: 3,
        spotId: 3,
        review: "Really loved this spot!",
        stars: 5,
      },
      {
        userId: 1,
        spotId: 4,
        review: "This was a great spot!",
        stars: 5,
      },
      {
        userId: 3,
        spotId: 4,
        review: "What a fantastic spot!",
        stars: 4,
      },
      {
        userId: 1,
        spotId: 5,
        review: "Greatly enjoyed this spot!",
        stars: 5,
      },
      {
        userId: 2,
        spotId: 5,
        review: "This was an epic spot!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 6,
        review: "What a beautiful spot!",
        stars: 4,
      },
      {
        userId: 1,
        spotId: 6,
        review: "Truly liked this spot!",
        stars: 5,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      stars: { [Op.between]: [1, 5]}
    }, {})
  }
};
