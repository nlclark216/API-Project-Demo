const express = require('express');
const { Op } = require('sequelize');

const { requireAuth, spotAuth, restoreUser } = require('../../utils/auth');
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
    .isFloat({ gt: 0})
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
router.get('/', restoreUser, validateQuery, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  page = page ? page : 1;
  size = size ? size : 20;
  
  page = parseInt(page);
  size = parseInt(size);

  const pagination = {};
  if (page >= 1 && size >= 1) {
      pagination.limit = size;
      pagination.offset = size * (page - 1);
  };

  const where = {};

  // Search filters

  if (minLat != undefined || maxLat != undefined) {
    const filter = []

    if (minLat != undefined) {
      filter.push({ [Op.gte]: parseFloat(minLat) });
    }

    if (maxLat != undefined) {
      filter.push({ [Op.lte]: parseFloat(maxLat) });
    }

    where.lat = { [Op.and]: filter };
  };

  if (minLng != undefined || maxLng != undefined) {
    const filter = []

    if (minLng != undefined) {
      filter.push({ [Op.gte]: parseFloat(minLng) });
    }

    if (maxLng != undefined) {
      filter.push({ [Op.lte]: parseFloat(maxLng) });
    }

    where.lng = { [Op.and]: filter };
  };

  if (minPrice != undefined || maxPrice != undefined) {
    const filter = []

    if (minPrice != undefined) {
      filter.push({ [Op.gte]: parseFloat(minPrice) });
    }

    if (maxPrice != undefined) {
      filter.push({ [Op.lte]: parseFloat(maxPrice) });
    }

    where.price = { [Op.and]: filter };
  };

  try{
    const allSpots = await Spot.findAll({
      ...pagination,
      ...where,
      attributes: [ 
        'id', 'ownerId', 'address', 'city', 'state', 'country',
        'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'] 
      ],
      include: [
        {
          model: SpotImage, 
          attributes: ['url'], 
          where: { preview: true },
          required: false,
          duplicating: false,
        },
        {
          model: Review,
          attributes: [],
          required: false,
          duplicating: false,
        }
      ],
      group: ['Spot.id', 'SpotImages.id'],
      order: ['id']
    });
    
    const formattedSpots = allSpots.map(spot => ({
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
      price: parseFloat(spot.price),
      createdAt: spot.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
      updatedAt: spot.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
      avgRating: spot.get('avgRating') ? +parseFloat(spot.get('avgRating')).toFixed(1) : null, 
      previewImage: spot.SpotImages.length ? spot.SpotImages[0].url : null
    }));
  
  return res.status(200).json({ 
    Spots: formattedSpots,
    page: page,
    size: size
  });
  } catch (error) { next(error); };
  
}); 

// Get all spots owned by current user
router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
  try {
    const { user } = req;

    const userSpots = await Spot.findAll({
      where: { ownerId: user.id },
      attributes: [ 
        'id', 'ownerId', 'address', 'city', 'state', 'country',
        'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'] 
      ],
      include: [
        {
          model: SpotImage, 
          attributes: ['url'], 
          where: { preview: true },
          required: false,
          duplicating: false,
        },
        {
          model: Review,
          attributes: [],
          required: false,
          duplicating: false,
        }
      ],
      group: ['Spot.id', 'SpotImages.id'],
      order: ['id']
    });

    const formattedSpots = userSpots.map(spot => ({
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
      price: parseFloat(spot.price),
      createdAt: spot.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
      updatedAt: spot.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
      avgRating: spot.get('avgRating') ? +parseFloat(spot.get('avgRating')).toFixed(1) : null, 
      previewImage: spot.SpotImages.length ? spot.SpotImages[0].url : null
    }));

    return res.status(200).json({ Spots: formattedSpots });
  } catch (error) { next(error) };
  
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findOne({
      where: { id: spotId },
      include: [
        { 
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if(!spot) { return res.status(404).json({ message: "Spot couldn't be found"}); }

    const aggregates = await Review.findOne({
      where: { spotId: spot.id },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('Review.id')), 'numReviews'],
        [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating']
      ]
    });

    const formattedSpot = {
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
      createdAt: spot.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
      updatedAt: spot.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
      numReviews: parseInt(aggregates.dataValues.numReviews) || 0,                    
      avgStarRating: +parseFloat(aggregates.dataValues.avgStarRating).toFixed(1) || 0,
      SpotImages: spot.SpotImages,                                    
      Owner: {                                                              
        id: spot.Owner.id,
        firstName: spot.Owner.firstName,
        lastName: spot.Owner.lastName
      }};
    
    return res.status(200).json(formattedSpot);
  } catch (error) { next(error) };
});

// Create a spot
router.post('/', restoreUser, requireAuth, validateSpot, async (req, res, next) => {
  const {user} = req;

  try {
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
    });};

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
        createdAt: spot.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/g, ''),
        updatedAt: spot.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/g, '')
      };

      return res.status(201).json(validSpot);
  } catch (error) { next(error) };
  
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', restoreUser, requireAuth, spotAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  try {
    const targetSpot = await Spot.findByPk(spotId);
    
    if(!targetSpot) return res.status(404).json({ message: "Spot couldn't be found"});

    const images = await SpotImage.findAll({
      where: { spotId: spotId }
    });

    if (images.length >= 10) {
      return res.status(403).json({ 
          message: "Maximum number of images for this resource was reached" 
      });
    };

    const newImg = await SpotImage.create({
      url: url,
      preview: preview,
      spotId: spotId
    });

    return res.status(201).json({
      id: newImg.id,
      url: newImg.url,
      preview: newImg.preview
    });
  } catch (error) { next(error) };
});

// Edit a Spot by Id
router.put('/:spotId', restoreUser, requireAuth, spotAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const { spotId } = req.params;

  try {
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
  } catch (error) { next(error) };
});

// Delete a Spot
router.delete('/:spotId', restoreUser, requireAuth, spotAuth, async (req, res, next) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);

    if(!spot) return res.status(404).json({ message: "Spot couldn't be found"});

    else {
      await spot.destroy();

      return res.status(200).json({ message: "Successfully deleted" });
    };
  } catch (error) { next(error) };  
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  try {
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
      ],
      order: ['id']
    });

    return res.status(200).json({ Reviews: reviews });
  }; 
  } catch (error) { next(error); };
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', restoreUser, requireAuth, validateReview, async (req, res, next) => {
  const { review, stars } = req.body;
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);
    
    if(!spot) return res.status(404).json({ message: "Spot couldn't be found"});
    const existingReview = await Review.findOne({ 
    where: { userId: req.user.id, 
              spotId: spotId
            } 
    });

    if (existingReview) {
      return res.status(500).json({ 
        message: "User already has a review for this spot" });
    };

    const newReview = await Review.create({ 
      userId: req.user.id, 
      spotId: spotId, 
      review: review, 
      stars: stars 
    });

    return res.status(201).json(newReview);
  } catch (error) { next(error); }
});




module.exports = router;