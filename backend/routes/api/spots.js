const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    }
);


module.exports = router;