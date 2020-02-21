const winston = require("winston");

module.exports = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      winston.warn("Issue with request query: ");
      winston.warn(error.details[0].message);
      winston.warn(req.query);
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
};
