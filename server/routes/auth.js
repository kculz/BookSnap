const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');
const {
  sanitizeSignup,
  sanitizeLogin,
  sanitizeForgotPassword,
  sanitizeResetPassword,
} = require('../sanitizers/auth.sanitizer');
const validate = require('../middlewares/validate.middleware');

router.post(
  '/signup',
  sanitizeSignup,
  signupValidator,
  validate,
  AuthController.signup
);

router.post(
  '/signin',
  sanitizeLogin,
  loginValidator,
  validate,
  AuthController.login
);

router.post(
  '/forgot-password',
  sanitizeForgotPassword,
  forgotPasswordValidator,
  validate,
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  sanitizeResetPassword,
  resetPasswordValidator,
  validate,
  AuthController.resetPassword
);

router.get('/verify-email/:token', AuthController.verifyEmail);

module.exports = {router};