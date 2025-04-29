const express = require('express');
const router = express.Router();
const multer = require('multer');
const PortfolioController = require('../controllers/PortfolioController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  createPortfolioValidator,
  updatePortfolioValidator,
  getPortfolioValidator,
  portfolioIdValidator
} = require('../validators/portfolio.validator');
const validate = require('../middlewares/validate.middleware');

const upload = multer({ dest: 'uploads/portfolio-temp/' });

// Photographer portfolio management
router.post(
  '/',
  authenticate,
  authorize('photographer'),
  upload.single('image'),
  createPortfolioValidator,
  validate,
  PortfolioController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('photographer'),
  upload.single('image'),
  portfolioIdValidator,
  updatePortfolioValidator,
  validate,
  PortfolioController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('photographer'),
  portfolioIdValidator,
  validate,
  PortfolioController.delete
);

// Get portfolio items
router.get(
  '/',
  authenticate,
  authorize('photographer'),
  getPortfolioValidator,
  validate,
  PortfolioController.getPhotographerPortfolio
);

router.get(
  '/:photographerId',
  getPortfolioValidator,
  PortfolioController.getPhotographerPortfolio
);

// Get single portfolio item
router.get(
  '/item/:id',
  portfolioIdValidator,
  validate,
  PortfolioController.getPortfolioItem
);

// Toggle featured status
router.patch(
  '/:id/featured',
  authenticate,
  authorize('photographer'),
  portfolioIdValidator,
  validate,
  PortfolioController.toggleFeatured
);

module.exports = {router};