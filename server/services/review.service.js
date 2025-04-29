const { Review, Booking, User, Photographer, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class ReviewService {
  static async createReview(bookingId, reviewData, clientId) {
    const transaction = await sequelize.transaction();
    try {
      // Verify the booking exists and belongs to this client
      const booking = await Booking.findOne({
        where: {
          id: bookingId,
          clientId,
          status: 'completed'
        },
        include: [{
          model: Photographer,
          include: [User]
        }],
        transaction
      });

      if (!booking) {
        throw new Error('Booking not found or not eligible for review');
      }

      // Check if review already exists for this booking
      const existingReview = await Review.findOne({
        where: { bookingId },
        transaction
      });

      if (existingReview) {
        throw new Error('You have already reviewed this booking');
      }

      // Create the review
      const review = await Review.create({
        bookingId,
        photographerId: booking.photographerId,
        clientId,
        ...reviewData
      }, { transaction });

      // Update photographer's average rating
      await this.updatePhotographerRating(booking.photographerId, transaction);

      await transaction.commit();
      logger.info(`Review created for booking ${bookingId}`);
      return review;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating review', { error });
      throw error;
    }
  }

  static async updateReview(reviewId, updateData, clientId) {
    const transaction = await sequelize.transaction();
    try {
      const review = await Review.findOne({
        where: { id: reviewId, clientId },
        include: [{
          model: Booking,
          attributes: ['photographerId']
        }],
        transaction
      });

      if (!review) {
        throw new Error('Review not found or not authorized');
      }

      // Update the review
      const updatedReview = await review.update(updateData, { transaction });

      // Update photographer's average rating
      await this.updatePhotographerRating(review.Booking.photographerId, transaction);

      await transaction.commit();
      logger.info(`Review ${reviewId} updated`);
      return updatedReview;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating review', { error });
      throw error;
    }
  }

  static async deleteReview(reviewId, userId, userRole) {
    const transaction = await sequelize.transaction();
    try {
      const where = { id: reviewId };
      
      // Clients can only delete their own reviews
      // Photographers can't delete reviews but admins can
      if (userRole === 'client') {
        where.clientId = userId;
      } else if (userRole !== 'admin') {
        throw new Error('Not authorized to delete this review');
      }

      const review = await Review.findOne({
        where,
        include: [{
          model: Booking,
          attributes: ['photographerId']
        }],
        transaction
      });

      if (!review) {
        throw new Error('Review not found or not authorized');
      }

      await review.destroy({ transaction });

      // Update photographer's average rating
      await this.updatePhotographerRating(review.Booking.photographerId, transaction);

      await transaction.commit();
      logger.info(`Review ${reviewId} deleted`);
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting review', { error });
      throw error;
    }
  }

  static async getReviewsByPhotographer(photographerId, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;

      const { count, rows } = await Review.findAndCountAll({
        where: { photographerId },
        include: [{
          model: User,
          as: 'Client',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }],
        order: [['createdAt', 'DESC']],
        limit: pageSize,
        offset
      });

      return {
        total: count,
        page,
        pageSize,
        reviews: rows
      };
    } catch (error) {
      logger.error('Error fetching photographer reviews', { error });
      throw error;
    }
  }

  static async getReviewsByClient(clientId, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;

      const { count, rows } = await Review.findAndCountAll({
        where: { clientId },
        include: [{
          model: Photographer,
          include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit: pageSize,
        offset
      });

      return {
        total: count,
        page,
        pageSize,
        reviews: rows
      };
    } catch (error) {
      logger.error('Error fetching client reviews', { error });
      throw error;
    }
  }

  static async getReviewById(reviewId) {
    try {
      const review = await Review.findByPk(reviewId, {
        include: [
          {
            model: User,
            as: 'Client',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          },
          {
            model: Photographer,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }]
          }
        ]
      });

      if (!review) {
        throw new Error('Review not found');
      }

      return review;
    } catch (error) {
      logger.error('Error fetching review', { error });
      throw error;
    }
  }

  static async updatePhotographerRating(photographerId, transaction) {
    const result = await Review.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
      ],
      where: { photographerId },
      transaction
    });

    await Photographer.update({
      rating: result.dataValues.averageRating,
      reviewCount: result.dataValues.reviewCount
    }, {
      where: { id: photographerId },
      transaction
    });
  }
}

module.exports = ReviewService;