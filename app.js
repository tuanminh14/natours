const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoute');
const bookingRouter = require('./routes/bookingRoutes');
const mongoSanitize = require('express-mongo-sanitize');

//Start express aa
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL MIDDLEWARES
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));
//1) Set security HTTP headers
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded());

//Data sanitization against NoSQLquery injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  // console.log('Hello from the middleware');
  next();
});

app.use(limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//3) Route

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server !`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
