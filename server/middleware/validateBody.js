const winston = require("winston");

module.exports = schema => {
  return (req, res, next) => {
    console.log(req.body);
    const { error } = schema.validate(req.body);
    if (error) {
      winston.warn("Issue with request body: ");
      winston.warn(error.details[0].message);
      winston.warn(req.body);
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
};
