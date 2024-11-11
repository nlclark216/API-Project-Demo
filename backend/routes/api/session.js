// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Email or username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
    handleValidationErrors
];

// Log in
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  try {
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      return res.status(401).json({ message: "Invalid credentials"});
    };

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };
    
    await setTokenCookie(res, safeUser);
    
    return res.json({ user: safeUser });
  } catch(error) { next(error); };
});

// Log out
router.delete('/', (_req, res, next) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  } catch(error) { next(error) };
});

// Get the current user
router.get('/', async (req, res, next) => {
  const { user } = req;

  try {
    if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };
    return res.json({ user: safeUser });
    } else return res.json({ user: null });
  } catch (error) { next(error) }
});




module.exports = router;