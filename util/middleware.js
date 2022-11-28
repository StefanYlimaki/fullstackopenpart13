const errorHandler = (error, req, res, next) => {
  console.error(error);

  if(error.name === 'SequelizeDatabaseError') {
    res.status(401).json({ error: 'Something went wrong'})
  } 
  if(error.name === 'SequelizeValidationError') {
    res.status(401).json({ error: 'Validation error'})
  }

  next(error);
};

module.exports = errorHandler;
