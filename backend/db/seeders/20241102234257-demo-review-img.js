'use strict';

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "review1 image1 url"
      },
      {
        reviewId: 2,
        url: "review2 image1 url"
      },
      {
        reviewId: 3,
        url: "review3 image1 url"
      },
      {
        reviewId: 4,
        url: "review4 image1 url"
      },
      {
        reviewId: 5,
        url: "review5 image1 url"
      },
      {
        reviewId: 6,
        url: "review6 image1 url"
      },
      {
        reviewId: 1,
        url: "review1 image2 url"
      },
      {
        reviewId: 2,
        url: "review2 image2 url"
      },
      {
        reviewId: 3,
        url: "review3 image2 url"
      },
      {
        reviewId: 4,
        url: "review4 image2 url"
      },
      {
        reviewId: 5,
        url: "review5 image2 url"
      },
      {
        reviewId: 6,
        url: "review6 image2 url"
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.substring]: '%url%'}
    }, {})
  }
};
