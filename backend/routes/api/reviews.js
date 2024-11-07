const express = require('express');

const { restoreUser, requireAuth, reviewAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage, SpotImage, Sequelize } = require('../../db/models');

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
router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;

    try {
      const reviews = await Review.findAll({
        where: { userId: user.id },
        include: [
            { 
            model: User,
            attributes: ['id', 'firstName', 'lastName']
            }, 
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
            { 
            model: ReviewImage ,
            attributes: ['id', 'url']
            }
        ]
      });
      
      if(!reviews) { return res.status(404).json({ message: "No reviews found"}); };

      return res.status(200).json({ Reviews: reviews });
    } catch (error) { next(error) };
    
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', restoreUser, requireAuth, reviewAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    try {
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
    } catch (error) { next(error); };
});

// Edit a Review
router.put('/:reviewId', restoreUser, requireAuth, reviewAuth, validateReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const { reviewId } = req.params;

    try {
        const findReview = await Review.findByPk(reviewId);

        if (!findReview) {
            return res.status(404).json({ message: "Review couldn't be found" });
        } else {
            await findReview.update({
                review:review,
                stars:stars
            });
            return res.status(200).json(findReview);
        };
    } catch (error) { next(error); };
});

// Delete a Review
router.delete('/:reviewId', restoreUser, requireAuth, reviewAuth, async (req, res, next) => {
    const { reviewId } = req.params;

    try {
        const existingReview = await Review.findByPk(reviewId);

        if (!existingReview) {return res.status(404).json({message: "Review couldn't be found"})};

        existingReview.destroy();
        
        return res.status(200).json({message: "Successfully deleted"});  
    } catch (error) { next(error); }; 
});





module.exports = [ router, validateReview ];