const { Availability, Booking, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const logger = require('../utils/logger');

class AvailabilityService {
  static async createAvailability(photographerId, availabilityData) {
    const transaction = await sequelize.transaction();
    try {
      // Validate no overlap with existing availabilities
      const overlapping = await Availability.findOne({
        where: {
          photographerId,
          dayOfWeek: availabilityData.dayOfWeek,
          [Op.or]: [
            {
              startTime: { [Op.lt]: availabilityData.endTime },
              endTime: { [Op.gt]: availabilityData.startTime }
            }
          ]
        },
        transaction
      });

      if (overlapping) {
        throw new Error('Availability overlaps with existing time slot');
      }

      // Validate no conflicting bookings
      if (availabilityData.specificDate) {
        const conflictingBooking = await Booking.findOne({
          where: {
            photographerId,
            status: ['confirmed', 'pending'],
            [Op.or]: [
              {
                startTime: { [Op.lt]: moment(availabilityData.specificDate).set('hour', availabilityData.endTime.split(':')[0]).set('minute', availabilityData.endTime.split(':')[1]).toDate() },
                endTime: { [Op.gt]: moment(availabilityData.specificDate).set('hour', availabilityData.startTime.split(':')[0]).set('minute', availabilityData.startTime.split(':')[1]).toDate() }
              }
            ]
          },
          transaction
        });

        if (conflictingBooking) {
          throw new Error('Availability conflicts with existing booking');
        }
      }

      const availability = await Availability.create({
        photographerId,
        ...availabilityData
      }, { transaction });

      await transaction.commit();
      logger.info(`Availability created for photographer ${photographerId}`);
      return availability;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating availability', { error });
      throw error;
    }
  }

  static async updateAvailability(availabilityId, photographerId, updateData) {
    const transaction = await sequelize.transaction();
    try {
      const availability = await Availability.findOne({
        where: { id: availabilityId, photographerId },
        transaction
      });

      if (!availability) {
        throw new Error('Availability not found or not authorized');
      }

      // Validate no overlap with other availabilities (excluding self)
      if (updateData.startTime || updateData.endTime || updateData.dayOfWeek) {
        const startTime = updateData.startTime || availability.startTime;
        const endTime = updateData.endTime || availability.endTime;
        const dayOfWeek = updateData.dayOfWeek || availability.dayOfWeek;

        const overlapping = await Availability.findOne({
          where: {
            photographerId,
            id: { [Op.ne]: availabilityId },
            dayOfWeek,
            [Op.or]: [
              {
                startTime: { [Op.lt]: endTime },
                endTime: { [Op.gt]: startTime }
              }
            ]
          },
          transaction
        });

        if (overlapping) {
          throw new Error('Updated availability overlaps with existing time slot');
        }
      }

      const updatedAvailability = await availability.update(updateData, { transaction });
      await transaction.commit();
      logger.info(`Availability ${availabilityId} updated`);
      return updatedAvailability;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating availability', { error });
      throw error;
    }
  }

  static async deleteAvailability(availabilityId, photographerId) {
    const transaction = await sequelize.transaction();
    try {
      const availability = await Availability.findOne({
        where: { id: availabilityId, photographerId },
        transaction
      });

      if (!availability) {
        throw new Error('Availability not found or not authorized');
      }

      await availability.destroy({ transaction });
      await transaction.commit();
      logger.info(`Availability ${availabilityId} deleted`);
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting availability', { error });
      throw error;
    }
  }

  static async getAvailabilities(photographerId, { startDate, endDate } = {}) {
    try {
      let where = { photographerId };
      let include = [];

      // If date range is provided, get both recurring and specific availabilities
      if (startDate && endDate) {
        const startDay = moment(startDate).format('dddd').toLowerCase();
        const endDay = moment(endDate).format('dddd').toLowerCase();

        where = {
          photographerId,
          [Op.or]: [
            // Recurring availabilities for days in the range
            { 
              isRecurring: true,
              dayOfWeek: { [Op.between]: [startDay, endDay] }
            },
            // Specific date availabilities within the range
            {
              isRecurring: false,
              specificDate: { [Op.between]: [startDate, endDate] }
            }
          ]
        };

        // Include conflicting bookings
        include = [
          {
            model: Booking,
            as: 'ConflictingBookings',
            where: {
              status: ['confirmed', 'pending'],
              [Op.or]: [
                // For recurring, check any day in the range
                sequelize.literal(`(
                  "Availability"."isRecurring" = true AND
                  EXTRACT(DOW FROM "Booking"."startTime") = 
                  CASE "Availability"."dayOfWeek"
                    WHEN 'monday' THEN 1
                    WHEN 'tuesday' THEN 2
                    WHEN 'wednesday' THEN 3
                    WHEN 'thursday' THEN 4
                    WHEN 'friday' THEN 5
                    WHEN 'saturday' THEN 6
                    WHEN 'sunday' THEN 0
                  END AND
                  "Booking"."startTime"::time < "Availability"."endTime" AND
                  "Booking"."endTime"::time > "Availability"."startTime"
                )`),
                // For specific dates, check exact date
                sequelize.literal(`(
                  "Availability"."isRecurring" = false AND
                  "Booking"."startTime"::date = "Availability"."specificDate" AND
                  "Booking"."startTime"::time < "Availability"."endTime" AND
                  "Booking"."endTime"::time > "Availability"."startTime"
                )`)
              ]
            },
            required: false
          }
        ];
      }

      const availabilities = await Availability.findAll({
        where,
        include,
        order: [
          ['isRecurring', 'DESC'],
          ['dayOfWeek', 'ASC'],
          ['startTime', 'ASC']
        ]
      });

      return availabilities;
    } catch (error) {
      logger.error('Error fetching availabilities', { error });
      throw error;
    }
  }

  static async checkAvailability(photographerId, startTime, endTime) {
    try {
      const dayOfWeek = moment(startTime).format('dddd').toLowerCase();
      const specificDate = moment(startTime).format('YYYY-MM-DD');

      // Check recurring availability
      const recurringAvailable = await Availability.findOne({
        where: {
          photographerId,
          isRecurring: true,
          dayOfWeek,
          startTime: { [Op.lte]: moment(startTime).format('HH:mm:ss') },
          endTime: { [Op.gte]: moment(endTime).format('HH:mm:ss') }
        }
      });

      // Check specific date availability
      const specificAvailable = await Availability.findOne({
        where: {
          photographerId,
          isRecurring: false,
          specificDate,
          startTime: { [Op.lte]: moment(startTime).format('HH:mm:ss') },
          endTime: { [Op.gte]: moment(endTime).format('HH:mm:ss') }
        }
      });

      // Check for conflicting bookings
      const conflictingBooking = await Booking.findOne({
        where: {
          photographerId,
          status: ['confirmed', 'pending'],
          [Op.or]: [
            {
              startTime: { [Op.lt]: endTime },
              endTime: { [Op.gt]: startTime }
            }
          ]
        }
      });

      return {
        isAvailable: (recurringAvailable || specificAvailable) && !conflictingBooking,
        conflictingBooking
      };
    } catch (error) {
      logger.error('Error checking availability', { error });
      throw error;
    }
  }
}

module.exports = AvailabilityService;