const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

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
  socialLinks: {
    type: Map,
    of: String,
    default: {},
    validate: validateSocialLinks,
  },
  dateLastModified: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

function validateSocialLinks(map) {
  const keys = Array.from(map.keys());

  if (keys.length > 10) throw new Error("Social Links should have a max of 10 keys. Don't abuse it!");

  for (const key of keys) {
    if (key.length > 100) throw new Error("Can't store a social link key with more than 100 characters");
  }

  for (const value of map.values()) {
    if (value.length > 1000) throw new Error("Can't store a social link value value with more than 1000 characters");
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

//Joi Schema
const joiGeneralSchema = Joi.object({
  title: Joi.string().min(2).max(64).required(),
  footnote: Joi.string().min(2).max(256).required(),
  socialLinks: Joi.object().pattern(Joi.string(), Joi.string().optional().allow("").max(256)),
});

exports.GeneralModel = GeneralModel;
exports.joiSchema = joiGeneralSchema;
