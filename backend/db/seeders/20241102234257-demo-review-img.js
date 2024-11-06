'use strict';

const { ReviewImage } = require('../models');

const reviewImages = [
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
];


module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImages, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    for (const img of reviewImages) {
      await ReviewImage.destroy({ where: img });
    }
  }
};
