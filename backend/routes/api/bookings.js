const express = require('express');
const { Op } = require('sequelize');

const { restoreUser, requireAuth, bookingAuth, bookingSpotAuth } = require('../../utils/auth');
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
    

    try {
      const { user } = req;
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

// Edit a Booking
router.put('/:bookingId', restoreUser, requireAuth, bookingAuth, validateBooking, async (req, res, next) => {
    

    try {
      const { startDate, endDate } = req.body;
      const { bookingId } = req.params;
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
          return res.status(404).json({ message: "Booking couldn't be found" });
      };

      const startTimestamp = new Date(req.body.startDate).toISOString();
      const endTimestamp = new Date(req.body.endDate).toISOString();

      const bookingConflicts = await Booking.findAll({
          where: {                        
            spotId: booking.spotId,            
            [Op.or]: 
            [
              { startDate: { [Op.between]: [startTimestamp, endTimestamp] }},
              { endDate: { [Op.between]: [startTimestamp, endTimestamp] }},
              { [Op.and]: [
                { startDate: { [Op.lte]: startTimestamp } },
                { endDate: { [Op.gte]: endTimestamp } }
              ]}
            ]}
      });

      if (bookingConflicts.length) {
        const errors = {};
      
        for (const conflict of bookingConflicts) {
          const conflictStartTimestamp = new Date(conflict.startDate).toISOString();
          const conflictEndTimestamp = new Date(conflict.endDate).toISOString();
    
          if (conflictStartTimestamp === startTimestamp || (conflictStartTimestamp < startTimestamp && startTimestamp < conflictEndTimestamp)) {
            errors.startDate = 'Start date conflicts with an existing booking';
          }
    
          if (conflictEndTimestamp === endTimestamp || (endTimestamp < conflictEndTimestamp && endTimestamp > conflictStartTimestamp)) {
            errors.endDate = 'End date conflicts with an existing booking';
          }
        }
        
        return res.status(403).json({
          message: 'Sorry, this spot is already booked for the specified dates',
          errors,
        });
      }

    
      booking.startDate = startDate;
      booking.endDate = endDate;
      await booking.save();
      return res.status(200).json({
          id: booking.id,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate.toISOString().substring(0, 10),
          endDate: booking.endDate.toISOString().substring(0, 10),
          createdAt: booking.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
          updatedAt: booking.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/g, '')
        });
    } catch (error) { next(error); }
});

// Delete a Booking
router.delete('/:bookingId', restoreUser, requireAuth, bookingSpotAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    };

    // Check if the booking has already started
    if (new Date(booking.startDate) <= new Date()) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        });
    };

   
        await booking.destroy();
        return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) { next(error); };
});



module.exports = [router, validateBooking];
