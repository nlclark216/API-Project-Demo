const express = require('express');
const { Op } = require('sequelize');

const { requireAuth, reviewAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .isString()
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .isInt({min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

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

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, reviewAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    const targetReview = await Review.findByPk(reviewId);

    if (!targetReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
    };

    const images = await ReviewImage.findAll({
        where: { reviewId: reviewId }
    });

    if (images.length >= 10) {
        return res.status(403).json({ 
            message: "Maximum number of images for this resource was reached" 
        });
    };

    const newImage = await targetReview.createReviewImage({ url });

    return res.status(201).json({
        id: newImage.id,
        url: newImage.url
    });
});





module.exports = [ router, validateReview ];