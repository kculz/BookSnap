const BookingService = require("../services/booking.service");
const logger = require("../utils/logger");

class BookingController {
  // Create Booking
  static async create(req, res) {
    try {
      // Authorization check
      if (req.user.role !== 'client') {
        return res.status(403).json({
          success: false,
          message: 'Only clients can create bookings'
        });
      }

      const booking = await BookingService.createBooking(req.body, req.user.id);
      
      return res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      logger.error('BookingController.create error', {
        error,
        userId: req.user?.id
      });
      
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Booking creation failed'
      });
    }
  }

  // Get Single Booking
  static async getById(req, res) {
    try {
      const booking = await BookingService.getBookingById(
        req.params.id, 
        req.user.id, 
        req.user.role
      );

      return res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      logger.error('BookingController.getById error', {
        error,
        bookingId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch booking'
      });
    }
  }

  // Update Booking
  static async update(req, res) {
    try {
      const updatedBooking = await BookingService.updateBooking(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );

      return res.json({
        success: true,
        data: updatedBooking
      });
    } catch (error) {
      logger.error('BookingController.update error', {
        error,
        bookingId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Booking update failed'
      });
    }
  }

  // Cancel Booking
  static async cancel(req, res) {
    try {
      const cancelledBooking = await BookingService.cancelBooking(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return res.json({
        success: true,
        data: cancelledBooking,
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      logger.error('BookingController.cancel error', {
        error,
        bookingId: req.params.id,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Booking cancellation failed'
      });
    }
  }

  // Get Client's Bookings
  static async getClientBookings(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({
          success: false,
          message: 'Only clients can access this endpoint'
        });
      }

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const result = await BookingService.getClientBookings(
        req.user.id,
        page,
        pageSize
      );

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('BookingController.getClientBookings error', {
        error,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch bookings'
      });
    }
  }

  // Get Photographer's Bookings
  static async getPhotographerBookings(req, res) {
    try {
      if (req.user.role !== 'photographer') {
        return res.status(403).json({
          success: false,
          message: 'Only photographers can access this endpoint'
        });
      }

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const result = await BookingService.getPhotographerBookings(
        req.user.id,
        page,
        pageSize
      );

      return res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('BookingController.getPhotographerBookings error', {
        error,
        userId: req.user?.id
      });

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch bookings'
      });
    }
  }
}

module.exports = BookingController;