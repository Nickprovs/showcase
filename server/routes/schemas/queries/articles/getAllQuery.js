const Joi = require("@hapi/joi");

module.exports = schema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(0)
    .max(100),
  offset: Joi.number()
    .integer()
    .min(0),
  dateOrder: Joi.string().valid("asc", "desc")
});
