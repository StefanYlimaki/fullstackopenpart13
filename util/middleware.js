const jwt = require("jsonwebtoken");
const { SECRET } = require("./config.js");
const { DisabledToken } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      if (
        DisabledToken.findOne({
          where: {
            token: authorization.substring(7),
          },
        })
      ) {
        return res.status(401).json({ error: "old token" });
      }
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "SequelizeDatabaseError") {
    res.status(401).json({ error: "Something went wrong" });
  }
  if (error.name === "SequelizeValidationError") {
    const errorMessages = [];
    error.errors.forEach((e) => errorMessages.push(e.message));
    res.status(401).json({ error: errorMessages });
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    const errorMessages = [];
    error.errors.forEach((e) => errorMessages.push(e.message));
    res.status(401).json({ error: errorMessages });
  }
  if (error.name === "Error") {
    res.status(401).json(error);
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  errorHandler,
};
