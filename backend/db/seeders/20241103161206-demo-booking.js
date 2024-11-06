'use strict';

const { Booking } = require('../models');

const bookings = [
  {
    spotId: 1,
    userId: 2,
    startDate: "2024-11-19",
    endDate: "2024-11-20",
  },
  {
    spotId: 3,
    userId: 3,
    startDate: "2024-11-19",
    endDate: "2024-11-20",
  },
  {
    spotId: 5,
    userId: 1,
    startDate: "2024-11-19",
    endDate: "2024-11-20",
  }
];


module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(bookings, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    for (const booking of bookings) {
      await Booking.destroy({ where: booking });
    }
  }
};
