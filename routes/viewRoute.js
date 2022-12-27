const express = require('express');
const viewsController = require('./../controllers/viewsController');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tours/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getMe);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

router.get('/my-tours', authController.protect, viewsController.getMyTours);

module.exports = router;
