const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = schema = Joi.object({
  softwareId: Joi.objectId(),
});
