const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dupplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidatorError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input value. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleInvalidToken = (err) => {
  return new AppError('Please provide valid Token', 400);
};

const handleExpiredToken = (err) => {
  return new AppError('Please provide valid Token', 400);
};
const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B) RENDERED WEBSITE
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //A) Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.msg,
      });
    }
    //B)Programming or other unknown error: dont want to leak error details
    //2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  //B RENDER WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });

    //B) Programming or other unknown error: dont want to leak error details
  }
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidatorError(error);
    if (error.name === 'JsonWebTokenError') error = handleInvalidToken(error);
    if (error.name === 'TokenExpiredError') error = handleExpiredToken(error);
    sendErrorProd(error, req, res);
  }
};
