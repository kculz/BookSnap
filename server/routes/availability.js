const express = require('express');
const router = express.Router();
const AvailabilityController = require('../controllers/AvailabilityController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate  = require('../middlewares/validate.middleware');
const {
  createAvailabilityValidator,
  updateAvailabilityValidator,
  getAvailabilitiesValidator,
  checkAvailabilityValidator,
  availabilityIdValidator,
} = require('../validators/availabilityValidators');

// Photographer availability management
router.post(
  '/',
  authenticate,
  authorize('photographer'),
  createAvailabilityValidator,
  validate,
  AvailabilityController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('photographer'),
  availabilityIdValidator,
  updateAvailabilityValidator,
  validate,
  AvailabilityController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('photographer'),
  availabilityIdValidator,
  validate,
  AvailabilityController.delete
);

// Get availabilities (for photographer or public)
router.get(
  '/',
  getAvailabilitiesValidator,
  validate,
  AvailabilityController.get
);

router.get(
  '/:photographerId',
  getAvailabilitiesValidator,
  validate,
  AvailabilityController.get
);

// Check specific availability
router.get(
  '/:photographerId/check',
  checkAvailabilityValidator,
  validate,
  AvailabilityController.check
);

module.exports = router;