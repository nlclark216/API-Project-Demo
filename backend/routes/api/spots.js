const express = require('express');
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    
    return res.status(200).json(spots);
    }  
);

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {ownerId: user.id}
    });

    if(spots)
    
    return res.status(200).json({
        Spots: spots
    });
    }  
);


module.exports = router;