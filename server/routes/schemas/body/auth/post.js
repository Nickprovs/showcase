const Joi = require("@hapi/joi");

module.exports = schema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(5).max(255).required(),
  captcha: Joi.string().min(5).required(),
});
