const Joi = require("@hapi/joi");

module.exports = schema = Joi.object({
  emailCode: Joi.string().min(2).max(50).required(),
});
