const { body, param, query } = require('express-validator');
const moment = require('moment');

const createAvailabilityValidator = [
  body('dayOfWeek')
    .optional()
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week'),
  
  body('startTime')
    .notEmpty().withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:mm format'),
  
  body('endTime')
    .notEmpty().withMessage('End time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:mm format')
    .custom((value, { req }) => {
      if (value <= req.body.startTime) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  
  body('isRecurring')
    .optional()
    .isBoolean().withMessage('isRecurring must be true or false'),
  
  body('specificDate')
    .optional()
    .isISO8601().withMessage('Specific date must be in YYYY-MM-DD format')
    .custom((value, { req }) => {
      if (req.body.isRecurring && value) {
        throw new Error('Cannot specify both recurring and specific date');
      }
      if (!req.body.isRecurring && !value) {
        throw new Error('Must specify either recurring or specific date');
      }
      return true;
    })
    .custom(value => {
      if (moment(value).isBefore(moment(), 'day')) {
        throw new Error('Specific date cannot be in the past');
      }
      return true;
    })
];

const updateAvailabilityValidator = [
  param('id')
    .isUUID().withMessage('Invalid availability ID'),
  
  body('startTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:mm format'),
  
  body('endTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:mm format')
    .custom((value, { req }) => {
      if (value && req.body.startTime && value <= req.body.startTime) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  
  body('isRecurring')
    .optional()
    .isBoolean().withMessage('isRecurring must be true or false'),
  
  body('specificDate')
    .optional()
    .isISO8601().withMessage('Specific date must be in YYYY-MM-DD format')
    .custom((value, { req }) => {
      if (req.body.isRecurring && value) {
        throw new Error('Cannot specify both recurring and specific date');
      }
      return true;
    })
    .custom(value => {
      if (moment(value).isBefore(moment(), 'day')) {
        throw new Error('Specific date cannot be in the past');
      }
      return true;
    })
];

const getAvailabilitiesValidator = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be in YYYY-MM-DD format'),
  
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be in YYYY-MM-DD format')
    .custom((value, { req }) => {
      if (req.query.startDate && value < req.query.startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

const checkAvailabilityValidator = [
  query('startTime')
    .notEmpty().withMessage('Start time is required')
    .isISO8601().withMessage('Start time must be in ISO8601 format'),
  
  query('endTime')
    .notEmpty().withMessage('End time is required')
    .isISO8601().withMessage('End time must be in ISO8601 format')
    .custom((value, { req }) => {
      if (moment(value).isBefore(moment(req.query.startTime))) {
        throw new Error('End time must be after start time');
      }
      return true;
    })
];

const availabilityIdValidator = [
  param('id')
    .isUUID().withMessage('Invalid availability ID')
];

module.exports = {
  createAvailabilityValidator,
  updateAvailabilityValidator,
  getAvailabilitiesValidator,
  checkAvailabilityValidator,
  availabilityIdValidator
};