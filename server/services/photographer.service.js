const { Photographer, User, Booking, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class PhotographerService {
  static async createPhotographerProfile(userId, profileData) {
    const transaction = await sequelize.transaction();
    try {
      // Check if user already has a photographer profile
      const existingProfile = await Photographer.findOne({ 
        where: { id: userId },
        transaction
      });
      
      if (existingProfile) {
        throw new Error('User already has a photographer profile');
      }

      const photographer = await Photographer.create({
        id: userId,
        ...profileData
      }, { transaction });

      await transaction.commit();
      logger.info(`Photographer profile created for user ${userId}`);
      return photographer;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating photographer profile', { error });
      throw error;
    }
  }

  static async updatePhotographerProfile(userId, updateData) {
    const transaction = await sequelize.transaction();
    try {
      const photographer = await Photographer.findByPk(userId, { transaction });
      
      if (!photographer) {
        throw new Error('Photographer profile not found');
      }

      const updatedProfile = await photographer.update(updateData, { transaction });
      
      await transaction.commit();
      logger.info(`Photographer profile updated for user ${userId}`);
      return updatedProfile;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating photographer profile', { error });
      throw error;
    }
  }

  static async getPhotographerProfile(userId) {
    try {
      const photographer = await Photographer.findByPk(userId, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          },
          {
            model: Booking,
            as: 'Bookings',
            limit: 5,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!photographer) {
        throw new Error('Photographer profile not found');
      }

      return photographer;
    } catch (error) {
      logger.error('Error fetching photographer profile', { error });
      throw error;
    }
  }

  static async searchPhotographers(filters, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const where = {};

      if (filters.specialization) {
        where.specialization = filters.specialization;
      }

      if (filters.minExperience) {
        where.yearsOfExperience = { [Op.gte]: filters.minExperience };
      }

      if (filters.maxRate) {
        where.hourlyRate = { [Op.lte]: filters.maxRate };
      }

      if (filters.isAvailable) {
        where.isAvailable = true;
      }

      const { count, rows } = await Photographer.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'avatar'],
            where: { isVerified: true }
          }
        ],
        order: [
          ['yearsOfExperience', 'DESC'],
          ['hourlyRate', 'ASC']
        ],
        limit: pageSize,
        offset
      });

      return {
        total: count,
        page,
        pageSize,
        photographers: rows
      };
    } catch (error) {
      logger.error('Error searching photographers', { error });
      throw error;
    }
  }

  static async updateAvailability(userId, isAvailable) {
    const transaction = await sequelize.transaction();
    try {
      const photographer = await Photographer.findByPk(userId, { transaction });
      
      if (!photographer) {
        throw new Error('Photographer profile not found');
      }

      const updated = await photographer.update({ isAvailable }, { transaction });
      
      await transaction.commit();
      logger.info(`Availability updated for photographer ${userId} to ${isAvailable}`);
      return updated;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating availability', { error });
      throw error;
    }
  }
}

module.exports = PhotographerService;