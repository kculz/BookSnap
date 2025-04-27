const { body } = require('express-validator');

const sanitizeInputs = (fields) => {
  return fields.map(field => 
    body(field).trim().escape()
  );
};

module.exports = {
  sanitizeSignup: sanitizeInputs(['email', 'password', 'firstName', 'lastName']),
  sanitizeLogin: sanitizeInputs(['email', 'password']),
  sanitizeForgotPassword: sanitizeInputs(['email']),
  sanitizeResetPassword: sanitizeInputs(['password', 'token']),
};