const { body, param, query } = require('express-validator');

const createReviewValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 20, max: 500 }).withMessage('Comment must be between 20-500 characters'),
  
  body('isAnonymous')
    .optional()
    .isBoolean().withMessage('isAnonymous must be true or false')
];

const updateReviewValidator = [
  param('id')
    .isUUID().withMessage('Invalid review ID'),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 20, max: 500 }).withMessage('Comment must be between 20-500 characters')
];

const getReviewsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Page size must be between 1-100')
];

const reviewIdValidator = [
  param('id')
    .isUUID().withMessage('Invalid review ID')
];

module.exports = {
  createReviewValidator,
  updateReviewValidator,
  getReviewsValidator,
  reviewIdValidator
};