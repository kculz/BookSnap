const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewsValidator,
  reviewIdValidator
} = require('../validators/review.validator');
const validate = require('../middlewares/validate.middleware');

// Create review for a booking
router.post(
  '/booking/:bookingId',
  authenticate,
  authorize('client'),
  createReviewValidator,
  validate,
  ReviewController.create
);

// Update review
router.put(
  '/:id',
  authenticate,
  authorize('client'),
  reviewIdValidator,
  updateReviewValidator,
  validate,
  ReviewController.update
);

// Delete review
router.delete(
  '/:id',
  authenticate,
  reviewIdValidator,
  validate,
  ReviewController.delete
);

// Get reviews by photographer
router.get(
  '/photographer/:photographerId',
  getReviewsValidator,
  validate,
  ReviewController.getPhotographerReviews
);

// Get reviews by client
router.get(
  '/client/:clientId?',
  authenticate,
  getReviewsValidator,
  validate,
  ReviewController.getClientReviews
);

// Get single review
router.get(
  '/:id',
  reviewIdValidator,
  validate,
  ReviewController.getReview
);

module.exports = {router};