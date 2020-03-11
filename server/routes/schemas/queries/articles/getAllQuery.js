const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = schema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(0)
    .max(100),
  offset: Joi.number()
    .integer()
    .min(0),
  category: Joi.alternatives().try(Joi.objectId(), Joi.string().pattern(new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$"))),
  search: Joi.string()
    .min(0)
    .max(128),
  dateOrder: Joi.string().valid("asc", "desc")
});
