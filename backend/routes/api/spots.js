const express = require('express');
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');
const { Spot, Sequelize, Review, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        attributes: {
            include: [
              [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
              [Sequelize.col('SpotImages.url'), 'previewImage']
      
            ]
          },
        include: [
        {
            model: Review, 
            attributes: []
        },
        {
            model: SpotImage,
            attributes: []
        }
        ],
        group: ['Spot.id', 'SpotImages.url']
    });

    // Format the response
    const formattedSpots = spots.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.get('avgRating') ? +parseFloat(spot.get('avgRating')).toFixed(1) : null,
        previewImage: spot.get('previewImage') || null
    }));
    
    return res.status(200).json({ Spots: formattedSpots });
  }  
); 

// Get all spots owned by current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {ownerId: user.id},
        attributes: {
            include: [
              [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
              [Sequelize.col('SpotImages.url'), 'previewImage']
      
            ]
          },
        include: [
        {
            model: Review, 
            attributes: []
        },
        {
            model: SpotImage,
            attributes: []
        }
        ],
        group: ['Spot.id', 'SpotImages.url']
    });

    const formattedSpots = spots.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.get('avgRating') ? +parseFloat(spot.get('avgRating')).toFixed(1) : null,
        previewImage: spot.get('previewImage') || null
    }));

    if(spots) return res.status(200).json({ Spots: formattedSpots });
    }  
);

// Get details of a Spot from an id

router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId,
        { 
          attributes: {
            include: [
              [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
              [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews']
            ]
          },
        include: [
          { 
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
          }, 
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Review,
            attributes: ['stars']
          }]
        });

        if(!spot) res.status(404).json({
            "message": "Spot couldn't be found"
        });

        const formattedSpots = 
        {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.get('avgRating') ? +parseFloat(spot.get('avgRating')).toFixed(1) : null,
            numReviews: spot.get('numReviews') ? +parseFloat(spot.get('numReviews')).toFixed(1) : null,
            SpotImages: spot.SpotImages,
            Owner: spot.Owner
        };

        return res.status(200).json({ Spots: formattedSpots });
});






module.exports = router;