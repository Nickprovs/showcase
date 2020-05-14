const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = schema = Joi.object({
  scope: Joi.string().valid("detailed", "verbatim").optional(),
});
