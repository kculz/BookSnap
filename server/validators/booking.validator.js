const { body, param } = require('express-validator');
const { Booking, Photographer, User } = require('../models');
const moment = require('moment');

const createBookingValidator = [
  body('photographerId')
    .trim()
    .notEmpty().withMessage('Photographer ID is required')
    .isUUID().withMessage('Photographer ID must be a valid UUID')
    .custom(async (photographerId) => {
      const photographer = await Photographer.findByPk(photographerId, {
        include: [{
          model: User,
          where: { isVerified: true }
        }]
      });
      if (!photographer) {
        throw new Error('Photographer not found or not verified');
      }
      if (!photographer.isAvailable) {
        throw new Error('Photographer is currently not accepting bookings');
      }
    }),

  body('startTime')
    .trim()
    .notEmpty().withMessage('Start time is required')
    .isISO8601().withMessage('Start time must be in ISO8601 format')
    .custom((value) => {
      if (moment(value).isBefore(moment().add(24, 'hours'))) {
        throw new Error('Bookings must be made at least 24 hours in advance');
      }
      return true;
    }),

  body('endTime')
    .trim()
    .notEmpty().withMessage('End time is required')
    .isISO8601().withMessage('End time must be in ISO8601 format')
    .custom((value, { req }) => {
      if (moment(value).isBefore(moment(req.body.startTime))) {
        throw new Error('End time must be after start time');
      }
      
      const durationHours = moment(value).diff(moment(req.body.startTime), 'hours');
      if (durationHours > 8) {
        throw new Error('Maximum booking duration is 8 hours');
      }
      if (durationHours < 1) {
        throw new Error('Minimum booking duration is 1 hour');
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const conflictingBookings = await Booking.count({
        where: {
          photographerId: req.body.photographerId,
          status: ['confirmed', 'pending'],
          [Op.or]: [
            {
              startTime: { [Op.lt]: value },
              endTime: { [Op.gt]: req.body.startTime }
            }
          ]
        }
      });

      if (conflictingBookings > 0) {
        throw new Error('Photographer is not available at the requested time');
      }
      return true;
    }),

  body('shootType')
    .trim()
    .notEmpty().withMessage('Shoot type is required')
    .isIn([
      'portrait', 'wedding', 'commercial',
      'event', 'product', 'landscape',
      'fashion', 'other'
    ]).withMessage('Invalid shoot type'),

  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Special requests must be less than 500 characters'),

  body('location.address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 255 }).withMessage('Address must be less than 255 characters'),

  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of 2 numbers')
    .custom((value) => {
      if (!value.every(coord => typeof coord === 'number')) {
        throw new Error('Coordinates must be numbers');
      }
      return true;
    })
];

const bookingIdValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Booking ID is required')
    .isUUID().withMessage('Booking ID must be a valid UUID')
    .custom(async (id, { req }) => {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Additional authorization check
      if (req.user.role === 'client' && booking.clientId !== req.user.id) {
        throw new Error('You can only access your own bookings');
      }
      
      if (req.user.role === 'photographer' && booking.photographerId !== req.user.id) {
        throw new Error('You can only access bookings for your services');
      }
      
      return true;
    })
];

const updateBookingValidator = [
  ...bookingIdValidator,
  
  body('status')
    .optional()
    .trim()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status value'),
    
  body('startTime')
    .optional()
    .trim()
    .isISO8601().withMessage('Start time must be in ISO8601 format'),
    
  body('endTime')
    .optional()
    .trim()
    .isISO8601().withMessage('End time must be in ISO8601 format')
    .custom((value, { req }) => {
      if (req.body.startTime && moment(value).isBefore(moment(req.body.startTime))) {
        throw new Error('End time must be after start time');
      }
      return true;
    })
];

module.exports = {
  createBookingValidator,
  bookingIdValidator,
  updateBookingValidator
};