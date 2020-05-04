const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = schema = Joi.object({
  name: Joi.string().min(0).max(80),
  email: Joi.string().email(),
  message: Joi.string().min(0).max(1000),
  captcha: Joi.string(),
});
