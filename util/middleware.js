const errorHandler = (error, req, res, next) => {

  if(error.name === 'SequelizeDatabaseError') {
    res.status(401).json({ error: 'Something went wrong'})
  } 
  if(error.name === 'SequelizeValidationError') {
    const errorMessages = [];
    error.errors.forEach(e => errorMessages.push(e.message))
    res.status(401).json({ error: errorMessages })
  }
  if(error.name === 'SequelizeUniqueConstraintError') {
    const errorMessages = [];
    error.errors.forEach(e => errorMessages.push(e.message))
    res.status(401).json({ error: errorMessages })
  }
  if(error.name === 'Error'){
    res.status(401).json(error)
  }

  next(error);
};

module.exports = errorHandler;
