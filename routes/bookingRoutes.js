const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router
  .route('/')
  .get(bookingController.getBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking)
  .get(bookingController.getOneBooking);

module.exports = router;
