const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  createBookingValidator,
  bookingIdValidator,
  updateBookingValidator
} = require('../validators/booking.validator');
const validate = require('../middlewares/validate.middleware');

// Client routes
router.post(
  '/',
  authenticate,
  authorize('client'),
  createBookingValidator,
  validate,
  BookingController.create
);

router.get(
  '/client',
  authenticate,
  authorize('client'),
  BookingController.getClientBookings
);

// Photographer routes
router.get(
  '/photographer',
  authenticate,
  authorize('photographer'),
  BookingController.getPhotographerBookings
);

// Common routes
router.get(
  '/:id',
  authenticate,
  bookingIdValidator,
  validate,
  BookingController.getById
);

router.put(
  '/:id',
  authenticate,
  bookingIdValidator,
  updateBookingValidator,
  validate,
  BookingController.update
);

router.patch(
  '/:id/cancel',
  authenticate,
  bookingIdValidator,
  validate,
  BookingController.cancel
);

module.exports = {router};