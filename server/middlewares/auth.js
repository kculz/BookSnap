// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn('Authentication failed', { error });
    return res.status(401).json({
      success: false,
      message: 'Please authenticate'
    });
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      logger.warn(`Unauthorized access attempt by ${req.user.id} for ${role} role`);
      return res.status(403).json({
        success: false,
        message: 'Access forbidden'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };