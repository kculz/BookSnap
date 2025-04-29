const PhotographerService = require('../services/photographer.service');
const logger = require('../utils/logger');

class PhotographerController {
  static async createProfile(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can create profiles'
        });
      }

      const profile = await PhotographerService.createPhotographerProfile(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        data: profile
      });
    } catch (error) {
      logger.error('PhotographerController.createProfile error', {
        error,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create photographer profile'
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can update profiles'
        });
      }

      const updatedProfile = await PhotographerService.updatePhotographerProfile(
        req.user.id,
        req.body
      );

      return res.json({
        success: true,
        data: updatedProfile
      });
    } catch (error) {
      logger.error('PhotographerController.updateProfile error', {
        error,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update photographer profile'
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const profile = await PhotographerService.getPhotographerProfile(
        req.params.id || req.user.id
      );

      return res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      logger.error('PhotographerController.getProfile error', {
        error,
        photographerId: req.params.id || req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch photographer profile'
      });
    }
  }

  static async search(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const result = await PhotographerService.searchPhotographers(
        req.query,
        page,
        pageSize
      );

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('PhotographerController.search error', { error });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to search photographers'
      });
    }
  }

  static async updateAvailability(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can update availability'
        });
      }

      const updated = await PhotographerService.updateAvailability(
        req.user.id,
        req.body.isAvailable
      );

      return res.json({
        success: true,
        data: updated,
        message: `Availability set to ${req.body.isAvailable}`
      });
    } catch (error) {
      logger.error('PhotographerController.updateAvailability error', {
        error,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update availability'
      });
    }
  }
}

module.exports = PhotographerController;