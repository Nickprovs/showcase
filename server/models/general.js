const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const portfolioSchema = {
  title: {
    type: String,
    minlength: 2,
    maxlength: 64,
    required: true,
    default: "Software",
  },
  show: {
    type: Boolean,
    required: true,
    default: true,
  },
};

//Mongo Schema
const mongoGeneralSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
  },
  footnote: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  portfolio: portfolioSchema,
  links: {
    type: Map,
    of: String,
    default: {},
    validate: validateLinks,
  },
  dateLastModified: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

function validateLinks(map) {
  const keys = Array.from(map.keys());

  if (keys.length > 10) throw new Error("Links should have a max of 10 keys. Don't abuse it!");

  for (const key of keys) {
    if (key.length > 1000) throw new Error("Can't store a link key with more than 1000 characters");
  }

  for (const value of map.values()) {
    if (value.length > 1000) throw new Error("Can't store a link value value with more than 1000 characters");
  }
  return true;
}

// transform for sending as json
function omitPrivate(doc, obj) {
  delete obj.__v;
  return obj;
}
mongoGeneralSchema.set("toJSON", { virtuals: false, transform: omitPrivate });

const GeneralModel = mongoose.model("General", mongoGeneralSchema);

const joiPortfolioSchema = Joi.object({
  title: Joi.string().min(2).max(64).required(),
  show: Joi.boolean().required(),
});

//Joi Schema
const joiGeneralSchema = Joi.object({
  title: Joi.string().min(2).max(64).required(),
  footnote: Joi.string().min(2).max(256).required(),
  links: Joi.object().pattern(Joi.string(), Joi.string().optional().allow("").max(256)),
  portfolio: joiPortfolioSchema,
});

exports.GeneralModel = GeneralModel;
exports.joiSchema = joiGeneralSchema;
