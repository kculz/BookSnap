const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: 'mail.curlben.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME || "no-reply@curlben.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: `"SnapBook" <no-reply@curlben.com>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
    logger.info(`Email sent to ${options.email}`);
  } catch (error) {
    logger.error(`Error sending email to ${options.email}:`, error);
    throw error;
  }
};

const sendWelcomeEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = `
    <p>Welcome to our platform! Please verify your email by clicking the link below:</p>
    <p><a href="${verificationUrl}">Verify Email</a></p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

  await sendEmail({
    email,
    subject: 'Welcome - Verify Your Email',
    html,
  });
};

const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail({
    email,
    subject: 'Password Reset Request',
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
};