// services/BookingService.js
const { Booking, Photographer, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const logger = require('../utils/logger');

class BookingService {
  static async createBooking(bookingData, clientId) {
    const transaction = await sequelize.transaction();
    try {
      // Validate photographer availability
      const conflictingBookings = await Booking.count({
        where: {
          photographerId: bookingData.photographerId,
          [Op.or]: [
            {
              startTime: { [Op.lt]: bookingData.endTime },
              endTime: { [Op.gt]: bookingData.startTime }
            }
          ]
        },
        transaction
      });

      if (conflictingBookings > 0) {
        throw new Error('Photographer is not available at the requested time');
      }

      // Create booking
      const booking = await Booking.create({
        ...bookingData,
        clientId,
        status: 'confirmed'
      }, { transaction });

      await transaction.commit();
      logger.info(`Booking ${booking.id} created successfully`);
      return booking;
    } catch (error) {
      await transaction.rollback();
      logger.error('Booking creation failed', { error });
      throw error;
    }
  }

  static async updateBooking(bookingId, updateData, userId, userRole) {
    const transaction = await sequelize.transaction();
    try {
      const booking = await Booking.findByPk(bookingId, { transaction });
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Authorization check
      if (userRole === 'client' && booking.clientId !== userId) {
        throw new Error('You can only update your own bookings');
      }
      if (userRole === 'photographer' && booking.photographerId !== userId) {
        throw new Error('You can only update bookings for your services');
      }

      // Validate time changes if they exist
      if (updateData.startTime || updateData.endTime) {
        const startTime = updateData.startTime || booking.startTime;
        const endTime = updateData.endTime || booking.endTime;

        if (moment(endTime).isBefore(moment(startTime))) {
          throw new Error('End time must be after start time');
        }

        const durationHours = moment(endTime).diff(moment(startTime), 'hours');
        if (durationHours > 8) {
          throw new Error('Maximum booking duration is 8 hours');
        }
        if (durationHours < 1) {
          throw new Error('Minimum booking duration is 1 hour');
        }

        // Check for conflicts (excluding current booking)
        const conflictingBookings = await Booking.count({
          where: {
            id: { [Op.ne]: bookingId },
            photographerId: booking.photographerId,
            status: ['confirmed', 'pending'],
            [Op.or]: [
              {
                startTime: { [Op.lt]: endTime },
                endTime: { [Op.gt]: startTime }
              }
            ]
          },
          transaction
        });

        if (conflictingBookings > 0) {
          throw new Error('Photographer is not available at the requested time');
        }
      }

      // Status transition validation
      if (updateData.status) {
        const validTransitions = {
          pending: ['confirmed', 'cancelled'],
          confirmed: ['completed', 'cancelled'],
          cancelled: [],
          completed: []
        };

        if (!validTransitions[booking.status].includes(updateData.status)) {
          throw new Error(`Invalid status transition from ${booking.status} to ${updateData.status}`);
        }

        // Additional business rules for cancellations
        if (updateData.status === 'cancelled') {
          const hoursUntilBooking = moment(booking.startTime).diff(moment(), 'hours');
          if (hoursUntilBooking < 24) {
            throw new Error('Bookings can only be cancelled at least 24 hours in advance');
          }
        }
      }

      // Apply updates
      const updatedBooking = await booking.update(updateData, { transaction });

      await transaction.commit();
      logger.info(`Booking ${bookingId} updated successfully`);
      return updatedBooking;
    } catch (error) {
      await transaction.rollback();
      logger.error(`Booking update failed for booking ${bookingId}`, { error });
      throw error;
    }
  }

  static async getBookingById(bookingId, userId, userRole) {
    try {
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Authorization check
      if (userRole === 'client' && booking.clientId !== userId) {
        throw new Error('You can only view your own bookings');
      }
      if (userRole === 'photographer' && booking.photographerId !== userId) {
        throw new Error('You can only view bookings for your services');
      }

      return booking;
    } catch (error) {
      logger.error(`Error fetching booking ${bookingId}`, { error });
      throw error;
    }
  }

  static async cancelBooking(bookingId, userId, userRole) {
    return this.updateBooking(bookingId, { status: 'cancelled' }, userId, userRole);
  }

  static async completeBooking(bookingId, userId, userRole) {
    return this.updateBooking(bookingId, { status: 'completed' }, userId, userRole);
  }

  static async getClientBookings(clientId, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      const { count, rows } = await Booking.findAndCountAll({
        where: { clientId },
        include: [
          {
            model: Photographer,
            include: [User]
          }
        ],
        order: [['startTime', 'DESC']],
        limit: pageSize,
        offset
      });

      return {
        total: count,
        page,
        pageSize,
        bookings: rows
      };
    } catch (error) {
      logger.error(`Error fetching bookings for client ${clientId}`, { error });
      throw error;
    }
  }

  static async getPhotographerBookings(photographerId, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      const { count, rows } = await Booking.findAndCountAll({
        where: { photographerId },
        include: [
          {
            model: User,
            as: 'Client',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['startTime', 'DESC']],
        limit: pageSize,
        offset
      });

      return {
        total: count,
        page,
        pageSize,
        bookings: rows
      };
    } catch (error) {
      logger.error(`Error fetching bookings for photographer ${photographerId}`, { error });
      throw error;
    }
  }
}

module.exports = BookingService;