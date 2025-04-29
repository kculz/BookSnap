const { body, param, query } = require('express-validator');

const createPhotographerValidator = [
  body('bio')
    .trim()
    .notEmpty().withMessage('Bio is required')
    .isLength({ min: 50, max: 1000 }).withMessage('Bio must be between 50-1000 characters'),
  
  body('specialization')
    .trim()
    .notEmpty().withMessage('Specialization is required')
    .isIn([
      'portrait', 'wedding', 'commercial',
      'event', 'product', 'landscape',
      'fashion', 'other'
    ]).withMessage('Invalid specialization'),
  
  body('yearsOfExperience')
    .isInt({ min: 0, max: 60 }).withMessage('Experience must be between 0-60 years'),
  
  body('hourlyRate')
    .isFloat({ min: 10, max: 500 }).withMessage('Hourly rate must be between $10-$500'),
  
  body('portfolioUrl')
    .optional()
    .isURL().withMessage('Invalid portfolio URL'),
  
  body('equipment')
    .isArray({ min: 1 }).withMessage('At least one equipment item is required')
    .custom(items => items.every(item => typeof item === 'string')).withMessage('Equipment items must be strings')
];

const updatePhotographerValidator = [
  body('bio')
    .optional()
    .trim()
    .isLength({ min: 50, max: 1000 }).withMessage('Bio must be between 50-1000 characters'),
  
  body('specialization')
    .optional()
    .isIn([
      'portrait', 'wedding', 'commercial',
      'event', 'product', 'landscape',
      'fashion', 'other'
    ]).withMessage('Invalid specialization'),
  
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 60 }).withMessage('Experience must be between 0-60 years'),
  
  body('hourlyRate')
    .optional()
    .isFloat({ min: 10, max: 500 }).withMessage('Hourly rate must be between $10-$500'),
  
  body('portfolioUrl')
    .optional()
    .isURL().withMessage('Invalid portfolio URL'),
  
  body('equipment')
    .optional()
    .isArray({ min: 1 }).withMessage('At least one equipment item is required')
];

const searchPhotographerValidator = [
  query('specialization')
    .optional()
    .isIn([
      'portrait', 'wedding', 'commercial',
      'event', 'product', 'landscape',
      'fashion', 'other'
    ]).withMessage('Invalid specialization'),
  
  query('minExperience')
    .optional()
    .isInt({ min: 0, max: 60 }).withMessage('Minimum experience must be between 0-60 years'),
  
  query('maxRate')
    .optional()
    .isFloat({ min: 10, max: 500 }).withMessage('Maximum rate must be between $10-$500'),
  
  query('isAvailable')
    .optional()
    .isBoolean().withMessage('Availability must be true or false'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Page size must be between 1-100')
];

const photographerIdValidator = [
  param('id')
    .isUUID().withMessage('Invalid photographer ID')
];

module.exports = {
  createPhotographerValidator,
  updatePhotographerValidator,
  searchPhotographerValidator,
  photographerIdValidator
};