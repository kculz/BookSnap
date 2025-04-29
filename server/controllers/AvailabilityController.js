const AvailabilityService = require('../services/availability.service');
const logger = require('../utils/logger');

class AvailabilityController {
  static async create(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can create availabilities'
        });
      }

      const availability = await AvailabilityService.createAvailability(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        data: availability
      });
    } catch (error) {
      logger.error('AvailabilityController.create error', {
        error,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create availability'
      });
    }
  }

  static async update(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can update availabilities'
        });
      }

      const availability = await AvailabilityService.updateAvailability(
        req.params.id,
        req.user.id,
        req.body
      );

      return res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      logger.error('AvailabilityController.update error', {
        error,
        availabilityId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update availability'
      });
    }
  }

  static async delete(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can delete availabilities'
        });
      }

      await AvailabilityService.deleteAvailability(
        req.params.id,
        req.user.id
      );

      return res.json({
        success: true,
        message: 'Availability deleted successfully'
      });
    } catch (error) {
      logger.error('AvailabilityController.delete error', {
        error,
        availabilityId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete availability'
      });
    }
  }

  static async get(req, res) {
    try {
      const availabilities = await AvailabilityService.getAvailabilities(
        req.params.photographerId || req.user.id,
        {
          startDate: req.query.startDate,
          endDate: req.query.endDate
        }
      );

      return res.json({
        success: true,
        data: availabilities
      });
    } catch (error) {
      logger.error('AvailabilityController.get error', {
        error,
        photographerId: req.params.photographerId || req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch availabilities'
      });
    }
  }

  static async check(req, res) {
    try {
      const { isAvailable, conflictingBooking } = await AvailabilityService.checkAvailability(
        req.params.photographerId,
        req.query.startTime,
        req.query.endTime
      );

      return res.json({
        success: true,
        data: {
          isAvailable,
          conflictingBooking: isAvailable ? null : conflictingBooking
        }
      });
    } catch (error) {
      logger.error('AvailabilityController.check error', {
        error,
        photographerId: req.params.photographerId
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to check availability'
      });
    }
  }
}

module.exports = AvailabilityController;