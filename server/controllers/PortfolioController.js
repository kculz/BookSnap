const PortfolioService = require('../services/portfolio.service');
const logger = require('../utils/logger');

class PortfolioController {
  static async create(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can add portfolio items'
        });
      }

      const portfolioItem = await PortfolioService.createPortfolioItem(
        req.user.id,
        req.body,
        req.file
      );

      return res.status(201).json({
        success: true,
        data: portfolioItem
      });
    } catch (error) {
      logger.error('PortfolioController.create error', {
        error,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create portfolio item'
      });
    }
  }

  static async update(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can update portfolio items'
        });
      }

      const portfolioItem = await PortfolioService.updatePortfolioItem(
        req.params.id,
        req.user.id,
        req.body,
        req.file
      );

      return res.json({
        success: true,
        data: portfolioItem
      });
    } catch (error) {
      logger.error('PortfolioController.update error', {
        error,
        portfolioId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update portfolio item'
      });
    }
  }

  static async delete(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can delete portfolio items'
        });
      }

      await PortfolioService.deletePortfolioItem(
        req.params.id,
        req.user.id
      );

      return res.json({
        success: true,
        message: 'Portfolio item deleted successfully'
      });
    } catch (error) {
      logger.error('PortfolioController.delete error', {
        error,
        portfolioId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete portfolio item'
      });
    }
  }

  static async getPhotographerPortfolio(req, res) {
    try {
      const portfolioItems = await PortfolioService.getPortfolioItems(
        req.params.photographerId || req.user.id,
        req.query
      );

      return res.json({
        success: true,
        data: portfolioItems
      });
    } catch (error) {
      logger.error('PortfolioController.getPhotographerPortfolio error', {
        error,
        photographerId: req.params.photographerId || req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch portfolio items'
      });
    }
  }

  static async getPortfolioItem(req, res) {
    try {
      const portfolioItem = await PortfolioService.getPortfolioItem(
        req.params.id
      );

      return res.json({
        success: true,
        data: portfolioItem
      });
    } catch (error) {
      logger.error('PortfolioController.getPortfolioItem error', {
        error,
        portfolioId: req.params.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch portfolio item'
      });
    }
  }

  static async toggleFeatured(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can modify portfolio items'
        });
      }

      const portfolioItem = await PortfolioService.toggleFeatured(
        req.params.id,
        req.user.id
      );

      return res.json({
        success: true,
        data: portfolioItem,
        message: `Item ${portfolioItem.isFeatured ? 'added to' : 'removed from'} featured`
      });
    } catch (error) {
      logger.error('PortfolioController.toggleFeatured error', {
        error,
        portfolioId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to toggle featured status'
      });
    }
  }
}

module.exports = PortfolioController;