'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};


module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "spot1 image1 url",
        preview: true
      },
      {
        spotId: 2,
        url: "spot2 image1 url",
        preview: true
      },
      {
        spotId: 3,
        url: "spot3 image1 url",
        preview: true
      },
      {
        spotId: 4,
        url: "spot4 image1 url",
        preview: true
      },
      {
        spotId: 5,
        url: "spot5 image1 url",
        preview: true
      },
      {
        spotId: 6,
        url: "spot6 image1 url",
        preview: true
      },
      {
        spotId: 1,
        url: "spot1 image2 url",
        preview: false
      },
      {
        spotId: 2,
        url: "spot2 image2 url",
        preview: false
      },
      {
        spotId: 3,
        url: "spot3 image2 url",
        preview: false
      },
      {
        spotId: 4,
        url: "spot4 image2 url",
        preview: false
      },
      {
        spotId: 5,
        url: "spot5 image2 url",
        preview: false
      },
      {
        spotId: 6,
        url: "spot6 image2 url",
        preview: false
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
       url: { [Op.substring]: '%url%'} 
    }, {});
  }
};
