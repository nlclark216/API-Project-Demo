// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  try {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = {};
    err.errors = errors;
    err.status = 400;
    err.title = "Bad Request";
    err.message = err.title;
    
    return res.status(400).json({
      message: err.message,
      errors: err.errors
    });
  }
} catch (error) { next(error); };
  
};

const handleExistingUser = (req, res, next) => {
  try {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = {};
    err.errors = errors;
    err.status = 400;
    err.title = "User already exists";
    err.message = err.title;
    
    return res.status(500).json({
      message: err.message,
      errors: err.errors
    });
  }
} catch (error) { next(error); }

};

module.exports = { handleValidationErrors, handleExistingUser };