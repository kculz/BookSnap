const { Portfolio, Photographer, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

class PortfolioService {
  static async createPortfolioItem(photographerId, portfolioData, imageFile) {
    const transaction = await sequelize.transaction();
    try {
      // Verify photographer exists
      const photographer = await Photographer.findByPk(photographerId, { transaction });
      if (!photographer) {
        throw new Error('Photographer not found');
      }

      // Upload image to Cloudinary
      let imageUrl, publicId;
      if (imageFile) {
        const result = await cloudinary.uploader.upload(imageFile.path, {
          folder: `photographers/${photographerId}/portfolio`,
          quality: 'auto:good'
        });
        imageUrl = result.secure_url;
        publicId = result.public_id;
        fs.unlinkSync(imageFile.path); // Remove temp file
      } else {
        throw new Error('Image is required');
      }

      const portfolioItem = await Portfolio.create({
        photographerId,
        imageUrl,
        publicId,
        ...portfolioData
      }, { transaction });

      await transaction.commit();
      logger.info(`Portfolio item created for photographer ${photographerId}`);
      return portfolioItem;
    } catch (error) {
      await transaction.rollback();
      if (imageFile && fs.existsSync(imageFile.path)) {
        fs.unlinkSync(imageFile.path); // Clean up temp file
      }
      logger.error('Error creating portfolio item', { error });
      throw error;
    }
  }

  static async updatePortfolioItem(portfolioId, photographerId, updateData, imageFile) {
    const transaction = await sequelize.transaction();
    try {
      const portfolioItem = await Portfolio.findOne({
        where: { id: portfolioId, photographerId },
        transaction
      });

      if (!portfolioItem) {
        throw new Error('Portfolio item not found or not authorized');
      }

      let imageUrl = portfolioItem.imageUrl;
      let publicId = portfolioItem.publicId;

      // If new image is provided
      if (imageFile) {
        // Upload new image
        const result = await cloudinary.uploader.upload(imageFile.path, {
          folder: `photographers/${photographerId}/portfolio`,
          quality: 'auto:good'
        });
        imageUrl = result.secure_url;
        publicId = result.public_id;
        fs.unlinkSync(imageFile.path); // Remove temp file

        // Delete old image
        if (portfolioItem.publicId) {
          await cloudinary.uploader.destroy(portfolioItem.publicId);
        }
      }

      const updatedItem = await portfolioItem.update({
        imageUrl,
        publicId,
        ...updateData
      }, { transaction });

      await transaction.commit();
      logger.info(`Portfolio item ${portfolioId} updated`);
      return updatedItem;
    } catch (error) {
      await transaction.rollback();
      if (imageFile && fs.existsSync(imageFile.path)) {
        fs.unlinkSync(imageFile.path); // Clean up temp file
      }
      logger.error('Error updating portfolio item', { error });
      throw error;
    }
  }

  static async deletePortfolioItem(portfolioId, photographerId) {
    const transaction = await sequelize.transaction();
    try {
      const portfolioItem = await Portfolio.findOne({
        where: { id: portfolioId, photographerId },
        transaction
      });

      if (!portfolioItem) {
        throw new Error('Portfolio item not found or not authorized');
      }

      // Delete image from Cloudinary
      if (portfolioItem.publicId) {
        await cloudinary.uploader.destroy(portfolioItem.publicId);
      }

      await portfolioItem.destroy({ transaction });
      await transaction.commit();
      logger.info(`Portfolio item ${portfolioId} deleted`);
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting portfolio item', { error });
      throw error;
    }
  }

  static async getPortfolioItems(photographerId, filters = {}) {
    try {
      const where = { photographerId };
      
      if (filters.category) {
        where.category = filters.category;
      }

      if (filters.isFeatured) {
        where.isFeatured = filters.isFeatured === 'true';
      }

      const portfolioItems = await Portfolio.findAll({
        where,
        order: [
          ['isFeatured', 'DESC'],
          ['createdAt', 'DESC']
        ]
      });

      return portfolioItems;
    } catch (error) {
      logger.error('Error fetching portfolio items', { error });
      throw error;
    }
  }

  static async getPortfolioItem(portfolioId) {
    try {
      const portfolioItem = await Portfolio.findByPk(portfolioId);
      if (!portfolioItem) {
        throw new Error('Portfolio item not found');
      }
      return portfolioItem;
    } catch (error) {
      logger.error('Error fetching portfolio item', { error });
      throw error;
    }
  }

  static async toggleFeatured(portfolioId, photographerId) {
    const transaction = await sequelize.transaction();
    try {
      const portfolioItem = await Portfolio.findOne({
        where: { id: portfolioId, photographerId },
        transaction
      });

      if (!portfolioItem) {
        throw new Error('Portfolio item not found or not authorized');
      }

      const updatedItem = await portfolioItem.update({
        isFeatured: !portfolioItem.isFeatured
      }, { transaction });

      await transaction.commit();
      logger.info(`Portfolio item ${portfolioId} featured status toggled to ${updatedItem.isFeatured}`);
      return updatedItem;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error toggling featured status', { error });
      throw error;
    }
  }
}

module.exports = PortfolioService;