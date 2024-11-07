const express = require('express');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Get all of the Current User's Bookings
router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;

    try {
        const bookings = await Booking.findAll ({
            where: { userId: user.id },
            include: {
                model: Spot,
                attributes: {exclude: ['createdAt', 'updatedAt']}
            },
            order: ['id']
        });

        if(!bookings) { return res.status(404).json({ message: "No bookings found"}); }

        return res.status(200).json({ Bookings: bookings });
    } catch (error) { next(error); };
});




module.exports = router;
