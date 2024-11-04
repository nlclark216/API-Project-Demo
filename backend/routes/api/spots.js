const express = require('express');

const { requireAuth, spotAuth } = require('../../utils/auth');
const { Spot, Sequelize, Review, SpotImage, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
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

// Add Query Filters to Get All Spots
const buildQueryOptions = async (query) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;

  // Set default values and validate query parameters
  page = page && page >= 1 ? parseInt(page) : 1;
  size = size && size >= 1 && size <= 20 ? parseInt(size) : 20;

  const errors = {};
  if (page < 1) errors.page = "Page must be greater than or equal to 1";
  if (size < 1 || size > 20) errors.size = "Size must be between 1 and 20";
  if (minLat && isNaN(minLat)) errors.minLat = "Minimum latitude is invalid";
  if (maxLat && isNaN(maxLat)) errors.maxLat = "Maximum latitude is invalid";
  if (minLng && isNaN(minLng)) errors.minLng = "Minimum longitude is invalid";
  if (maxLng && isNaN(maxLng)) errors.maxLng = "Maximum longitude is invalid";
  if (minPrice && (isNaN(minPrice) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

  if (Object.keys(errors).length) { return { errors }; };

  // Build the query options
  const queryOptions = {
    where: {},
    limit: size,
    offset: (page - 1) * size,
    include: [
      {
        model: Review,
        attributes: []
      },
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false
      }
    ],
    attributes: {
      include: [
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        [Sequelize.col('SpotImages.url'), 'previewImage']
      ]
    },
    group: ['Spot.id', 'SpotImages.url']
  };

  if (minLat) queryOptions.where.lat = { [Op.gte]: parseFloat(minLat) };
  if (maxLat) queryOptions.where.lat = { ...queryOptions.where.lat, [Op.lte]: parseFloat(maxLat) };
  if (minLng) queryOptions.where.lng = { [Op.gte]: parseFloat(minLng) };
  if (maxLng) queryOptions.where.lng = { ...queryOptions.where.lng, [Op.lte]: parseFloat(maxLng) };
  if (minPrice) queryOptions.where.price = { [Op.gte]: parseFloat(minPrice) };
  if (maxPrice) queryOptions.where.price = { ...queryOptions.where.price, [Op.lte]: parseFloat(maxPrice) };

  return { queryOptions, page, size };
};

// Get all spots
router.get('/', async (req, res) => {
  let spots;
  const { queryOptions, page, size, errors } = await buildQueryOptions(req.query);

  if (errors) { return res.status(400).json({
    message: "Bad Request",
    errors: errors
    });
  } else if (!errors){
    spots = await Spot.findAll(queryOptions);
  } else {
    spots = await Spot.findAll({
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
  };

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
    
  return res.status(200).json({ 
    Spots: formattedSpots,
    page: page || null,
    size: size || null
   });
}); 

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
        include: 
        [{
            model: Review, 
            attributes: []
        },
        {
            model: SpotImage,
            attributes: []
        }],
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
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  const spots = await Spot.findAll({
    where: { id: spotId },
    attributes: {
      include: [
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews']
      ]
    },
    include: 
      [{
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Review,
        attributes: ['stars']
      },
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview'],
        limit: 20
      }],
    group: ['Spot.id', 'Owner.id', 'Reviews.id'] 
  });

  if(!spots) {
      return res.status(404).json({ message: "Spot couldn't be found"});
  } else {
    const formattedSpots = spots.map(spot => ({
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
      SpotImages: spot.get('SpotImages'),
      Owner: spot.Owner
    }));
    return res.status(200).json({ Spots: formattedSpots });
  };
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
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }, {
        model: ReviewImage,
        attributes: ['id', 'url']
      }]
    });
    return res.status(200).json({ Reviews: reviews });
  }

  
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