const express = require('express');
const { Op } = require('sequelize');

const { requireAuth, spotAuth } = require('../../utils/auth');
const { Spot, Sequelize, Review, SpotImage, User, ReviewImage } = require('../../db/models');

const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview  = require('./reviews');

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

const validateQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1")
    .default(1),
  query('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20")
    .default(20),
  query('minLat')
    .isDecimal()
    .optional()
    .withMessage("Minimum latitude is invalid"),
  query('maxLat')
    .isDecimal()
    .optional()
    .withMessage("Maximum latitude is invalid"),
  query('minLng')
    .isDecimal()
    .optional()
    .withMessage("Minimum longitude is invalid"),
  query('maxLng')
    .isDecimal()
    .optional()
    .withMessage("Maximum longitude is invalid"),
  query('minPrice')
    .isDecimal({ min: 0 })
    .optional()
    .withMessage("Minimum price must be greater than or equal to 0"),
  query('maxPrice')
    .isDecimal({ min: 0 })
    .optional()
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors
];



// Get all spots
router.get('/', validateQuery, async (req, res, next) => {
  let { page, size } = req.query;

  if(!page) page = 1;
  if(!size) size = 20;
  
  page = parseInt(page);
  size = parseInt(size);

  const pagination = {};
  if (page >= 1 && size >= 1) {
      pagination.limit = size;
      pagination.offset = size * (page - 1);
  };

  const spots = await Spot.findAll(
    {
      attributes: {
          include: [
            [Sequelize.literal('(SELECT AVG(Stars) FROM Reviews WHERE Reviews.spotId = Spot.id)'), 'avgRating'],
            [Sequelize.literal('(SELECT url FROM SpotImages WHERE SpotImages.spotId = Spot.id AND preview = true)'), 'previewImage']
          ], 
      }, 
      group: [['Spot.id', 'SpotImages.url']],
      ...pagination
    }
  );
  
  return res.status(200).json({ 
    Spots: spots,
    page: page || 1,
    size: size || 20
  });
}); 

// Get all spots owned by current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {ownerId: {[Op.eq]: user.id}},
        attributes: {
          include: [
            [Sequelize.literal('(SELECT AVG(Stars) FROM Reviews WHERE Reviews.spotId = Spot.id)'), 'avgRating'],
            [Sequelize.literal('(SELECT url FROM SpotImages WHERE SpotImages.spotId = Spot.id AND preview = true)'), 'previewImage']
          ], 
        }, 
        group: [['Spot.id', 'SpotImages.url']]
    });

    if(spots) return res.status(200).json({ Spots: spots });    
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  const spots = await Spot.findAll({
    where: { id: spotId },
    attributes: {
      include: [
        [Sequelize.literal('(SELECT AVG(Stars) FROM Reviews WHERE Reviews.spotId = Spot.id)'), 'avgRating'],
        [Sequelize.literal('(SELECT COUNT(*) FROM Reviews WHERE Reviews.spotId = Spot.id)'), 'numReviews']
      ], 
    }, 
    group: [['Spot.id', 'SpotImages.url']],
    include: 
      [{
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }],
  });

  if(!spots) {
      return res.status(404).json({ message: "Spot couldn't be found"});
  } else { return res.status(200).json({ Spots: spots }); };
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
    });
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

  return res.status(201).json(validSpot);
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, spotAuth, async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(!spot) return res.status(404).json({ message: "Spot couldn't be found"});

  const { url, preview } = req.body;

  const img = await SpotImage.create({
    url: url,
    preview: preview,
    spotId: spot.id
  });

  return res.status(201).json({
    id: img.id,
    url: img.url,
    preview: img.preview
  });
});

// Edit a Spot
router.put('/:spotId', requireAuth, spotAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(!spot) return res.status(404).json({ message: "Spot couldn't be found"});

  else {
    const existingAddress = await Spot.findOne({
      where: { address: address }});
      
    if(existingAddress) {
      return res.status(500).json({
        message: "Spot with that address is already on file",
        errors: {
          address: "Spot with that address already exists"
        }
      });
    };

    await spot.update({
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price
    });
    
    return res.status(200).json(spot);
  }
});

// Delete a Spot
router.delete('/:spotId', requireAuth, spotAuth, async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(!spot) return res.status(404).json({ message: "Spot couldn't be found"});

  else {
    await spot.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  };
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(!spot){
    return res.status(404).json({ message: "Spot couldn't be found" })
  } else {
    const reviews = await Review.findAll({
      where: { spotId: spotId },
      include: [
        {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
        }, 
        {
        model: ReviewImage,
        attributes: ['id', 'url']
        }
      ]
    });
    return res.status(200).json({ Reviews: reviews });
  };  
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { review, stars } = req.body;

  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(!spot) return res.status(404).json({ message: "Spot couldn't be found"});

  const existingReview = await Review.findOne({ 
    where: { userId: req.user.id, 
              spotId: spotId
            } 
  });

  if (existingReview) {
    return res.status(403).json({ 
      message: "User already has a review for this spot" });
  };

  const newReview = await Review.create({ 
    userId: req.user.id, 
    spotId: spotId, 
    review: review, 
    stars: stars 
  });

  return res.status(201).json(newReview);
});




module.exports = router;