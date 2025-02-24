'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
};

const reviews = [
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
    userId: 1,
    spotId: 3,
    review: "What a fantastic spot!",
    stars: 4,
  },
  {
    userId: 3,
    spotId: 4,
    review: "What a beautiful spot!",
    stars: 4,
  },
  {
    userId: 1,
    spotId: 5,
    review: "Really liked the scenery at this spot!",
    stars: 5,
  },
  {
    userId: 2,
    spotId: 6,
    review: "What a nice spot!",
    stars: 4,
  },
];


module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate(reviews, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    for (const review of reviews) {
      await Review.destroy({ where: review });
    }
  }
};
