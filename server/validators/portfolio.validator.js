const { body, param, query } = require('express-validator');

const createPortfolioValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn([
      'portrait', 'wedding', 'commercial',
      'event', 'product', 'landscape',
      'fashion', 'other'
    ]).withMessage('Invalid category'),
  
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be true or false')
];

const updatePortfolioValidator = [
  param('id')
    .isUUID().withMessage('Invalid portfolio item ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  
  body('category')
    .optional()
    .isIn([
      'portrait', 'wedding', 'commercial',
      'event', 'product', 'landscape',
      'fashion', 'other'
    ]).withMessage('Invalid category'),
  
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be true or false')
];

const getPortfolioValidator = [
  query('category')
    .optional()
    .isIn([
      'portrait', 'wedding', 'commercial',
      'event', 'product', 'landscape',
      'fashion', 'other'
    ]).withMessage('Invalid category'),
  
  query('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be true or false')
];

const portfolioIdValidator = [
  param('id')
    .isUUID().withMessage('Invalid portfolio item ID')
];

module.exports = {
  createPortfolioValidator,
  updatePortfolioValidator,
  getPortfolioValidator,
  portfolioIdValidator
};