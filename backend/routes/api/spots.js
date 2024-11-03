const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Sequelize, Review, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
  check('address')
    .exists({checkFalsy: true})
    .isLength({min: 2})
    .withMessage("Street address is required"),
  check('city')
    .exists({checkFalsy: true})
    .isLength({min: 2})
    .withMessage("City is required"),
  check('state')
    .exists({checkFalsy: true})
    .isLength({min: 2})
    .withMessage("State is required"),
  check('country')
    .exists({checkFalsy: true})
    .isLength({min: 2})
    .withMessage( "Country is required"),
  check('lat')
    .exists({checkFalsy: true})
    .isFloat({
      min: -90,
      max: 90})
    .withMessage("Latitude must be within -90 and 90"),
  check('lng')
    .exists({checkFalsy: true})
    .isFloat({
      min: -180,
      max: 180})
    .withMessage("Longitude must be within -180 and 180"),
  check('name')
    .exists({checkFalsy: true})
    .isLength({max: 50})
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({checkFalsy: true})
    .isLength({min: 1})
    .withMessage("Description is required"),
  check('price')
    .exists({checkFalsy: true})
    .isFloat({ min: 0})
    .withMessage("Price per day must be a positive number"),
    handleValidationErrors
];

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

    const findSpot = await Spot.findByPk(spotId);
    if(!findSpot) {
      return res.status(404).json({
      message: "Spot couldn't be found"
    })
    } else {
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
    }
    


       
    
    

});

// Create a spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const {user} = req;

  const {address, city, state, country, 
    lat, lng, name, description, price } = req.body;

  const existingAddress = await Spot.findOne({
    where: { address: address }});

  if(existingAddress) {
    return res.status(500).json({
      message: "Spot with that address is already on file",
      errors: {
        address: "Spot with that address already exists"
      }
    })
  };

  const spot = await Spot.create({address, city, state, country, 
    lat, lng, name, description, price, ownerId: user.id});

  const validSpot = {
    id: spot.id,
    ownerId: user.id, 
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
    updatedAt: spot.updatedAt
  };


  return res.status(201).json({ 
    id: validSpot.id,
    ownerId: validSpot.ownerId,
    address: validSpot.address, 
    city: validSpot.city,
    state: validSpot.state,
    country: validSpot.country,
    lat: validSpot.lat,
    lng: validSpot.lng,
    name: validSpot.name,
    description: validSpot.description,
    price: validSpot.price,
    createdAt: validSpot.createdAt,
    updatedAt: validSpot.updatedAt        
  });
});




module.exports = router;