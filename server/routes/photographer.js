const express = require('express');
const router = express.Router();
const PhotographerController = require('../controllers/PhotographerController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  createPhotographerValidator,
  updatePhotographerValidator,
  searchPhotographerValidator,
  photographerIdValidator
} = require('../validators/photographer.validator');
const validate = require('../middlewares/validate.middleware');

// Photographer profile management
router.post(
  '/profile',
  authenticate,
  authorize('photographer'),
  createPhotographerValidator,
  validate,
  PhotographerController.createProfile
);

router.put(
  '/profile',
  authenticate,
  authorize('photographer'),
  updatePhotographerValidator,
  validate,
  PhotographerController.updateProfile
);

router.get(
  '/profile',
  authenticate,
  authorize('photographer'),
  PhotographerController.getProfile
);

// Public endpoints
router.get(
  '/',
  searchPhotographerValidator,
  validate,
  PhotographerController.search
);

router.get(
  '/:id',
  photographerIdValidator,
  validate,
  PhotographerController.getProfile
);

// Availability management
router.patch(
  '/availability',
  authenticate,
  authorize('photographer'),
  PhotographerController.updateAvailability
);

module.exports = {router};