const express = require('express');
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage } = require('../../db/models');

const router = express.Router();

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    const reviews = await Review.findAll({
        where: { userId: user.id },
        include: [{ 
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }, { 
            model: Spot,
            attributes: {exclude: ["description", 'createdAt', 'updatedAt']}
        }, { 
            model: ReviewImage ,
            attributes: ['id', 'url']
        }]
    });

    return res.status(200).json({ Reviews: reviews });
});





module.exports = router;