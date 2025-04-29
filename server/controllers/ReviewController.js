const ReviewService = require('../services/review.service');
const logger = require('../utils/logger');

class ReviewController {
  static async create(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({
          success: false,
          message: 'Only clients can create reviews'
        });
      }

      const review = await ReviewService.createReview(
        req.params.bookingId,
        req.body,
        req.user.id
      );

      return res.status(201).json({
        success: true,
        data: review
      });
    } catch (error) {
      logger.error('ReviewController.create error', {
        error,
        bookingId: req.params.bookingId,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create review'
      });
    }
  }

  static async update(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({
          success: false,
          message: 'Only clients can update reviews'
        });
      }

      const review = await ReviewService.updateReview(
        req.params.id,
        req.body,
        req.user.id
      );

      return res.json({
        success: true,
        data: review
      });
    } catch (error) {
      logger.error('ReviewController.update error', {
        error,
        reviewId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update review'
      });
    }
  }

  static async delete(req, res) {
    try {
      await ReviewService.deleteReview(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      logger.error('ReviewController.delete error', {
        error,
        reviewId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete review'
      });
    }
  }

  static async getPhotographerReviews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const result = await ReviewService.getReviewsByPhotographer(
        req.params.photographerId,
        page,
        pageSize
      );

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('ReviewController.getPhotographerReviews error', {
        error,
        photographerId: req.params.photographerId
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch reviews'
      });
    }
  }

  static async getClientReviews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const result = await ReviewService.getReviewsByClient(
        req.params.clientId || req.user.id,
        page,
        pageSize
      );

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('ReviewController.getClientReviews error', {
        error,
        clientId: req.params.clientId || req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch reviews'
      });
    }
  }

  static async getReview(req, res) {
    try {
      const review = await ReviewService.getReviewById(
        req.params.id
      );

      return res.json({
        success: true,
        data: review
      });
    } catch (error) {
      logger.error('ReviewController.getReview error', {
        error,
        reviewId: req.params.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch review'
      });
    }
  }
}

module.exports = ReviewController;