const { Payment } = require('../models');

class PaymentService {
  static async getAll() {
    return await Payment.findAll();
  }

  // Add other service methods here
}

module.exports = PaymentService;