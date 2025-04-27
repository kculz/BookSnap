const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models');
const {
  sendResetPasswordEmail,
  sendWelcomeEmail,
} = require('../services/email.service');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET ,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

const AuthController = {
  async signup(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

     
      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        provider: 'local',
        role: 'client',
        isVerified: false,
      });

      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = Date.now() + 360000000; // 1 hour
      await user.save();

      // Send welcome email
      await sendWelcomeEmail(user.email, verificationToken);

      // Generate JWT
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email, provider: 'local' },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check if account is verified
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Account not verified. Please check your email.',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT
      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email, provider: 'local' },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account with that email exists',
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send reset email
      await sendResetPasswordEmail(user.email, resetToken);

      return res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const { password, token } = req.body;

      // Find user by token
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Password reset token is invalid or has expired',
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },

  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // Find user by token
      const user = await User.findOne({
        where: {
          verificationToken: token,
          verificationTokenExpires: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is invalid or has expired',
        });
      }

      // Verify user
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      console.error('Email verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  },
};

module.exports = AuthController;