const stripe = require('stripe')(
  'sk_test_51MDnFVInuCLRAOs3RUfDajU31CvoWftHFpXNA61z8jEmgGvcQTxT9tir1GB4bXyd0bHiE7itE0ZTV95vZnjk5BGM00O0CPpBi7'
);
const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./HandlerFactory');
const AppError = require('./../utils/appError');
const Booking = require('./../models/bookingModel');
const HandlerFactory = require('./HandlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  //2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });
  //3)Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
};

exports.createBookingCheckout = async (req, res, next) => {
  //This is only Temporary, because its UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
};

exports.getBookings = HandlerFactory.getAll(Booking);
exports.getOneBooking = HandlerFactory.getOne(Booking);
exports.createBooking = HandlerFactory.createOne(Booking);
exports.updateBooking = HandlerFactory.updateOne(Booking);
exports.deleteBooking = HandlerFactory.deleteOne(Booking);
