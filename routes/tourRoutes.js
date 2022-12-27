const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const router = express.Router();
const reviewRoutes = require('./../routes/reviewRoutes');

// router.param('id', tourController.checkID);

// router
//   .route('/:id/reviews')
//   .post(authController.protect, reviewController.createReview);

router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/monthly-plan/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/tours-within/:distance/center/:center/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:center/unit/:unit').get(tourController.getDistances);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
