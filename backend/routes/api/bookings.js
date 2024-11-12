const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage, Sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateBooking = [
    check('startDate')
      .exists({ checkFalsy: true })
      .withMessage('Start date is required')
      .isISO8601()
      .withMessage('Start date must be a valid date')
      .custom((value) => {
        const startDate = new Date(value);
        if (startDate < new Date()) {
          throw new Error("startDate cannot be in the past");
        }
        return true;
      }),
    check('endDate')
      .exists({ checkFalsy: true })
      .withMessage('End date is required')
      .isISO8601()
      .withMessage('End date must be a valid date')
      .custom((value, { req }) => {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error("endDate cannot be on or before startDate");
        }
        return true;
      }),
    handleValidationErrors
  ];

// Get all of the Current User's Bookings
router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;

    try {
        const bookings = await Booking.findAll ({
            where: { userId: user.id },
            include: [ 
                { 
                model: Spot,
                include: [
                    {
                      model: SpotImage,
                      attributes: [],
                      required: false,
                      where: { preview: true }
                    },
                  ],
                  attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price',
                    [Sequelize.literal('"Spot->SpotImages"."url"'), 'previewImage']]
                }, 
               ],
            order: ['id']
        });


        if(!bookings) { return res.status(404).json({ message: "No bookings found"}); }

        const formattedBooking = bookings.map(b => ({
            id: b.id,
            spotId: b.spotId,
            Spot: b.Spot,
            userId: b.userId,
            startDate: b.startDate.toISOString().substring(0, 10),
            endDate: b.endDate.toISOString().substring(0, 10),
            createdAt: b.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
            updatedAt: b.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/g, '')
        }));

        return res.status(200).json({ Bookings: formattedBooking });
    } catch (error) { next(error); };
});




module.exports = [router, validateBooking];
