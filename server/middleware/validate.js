const winston = require("winston");

module.exports = validator => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      winston.warn("Issue with request: ");
      winston.warn(error.details[0].message);
      winston.warn(req.body);
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
};
