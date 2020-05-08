const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

//Mongo Schema
const mongoFeaturedSchema = new mongoose.Schema({
  body: {
    type: String,
    minlength: 2,
    required: true,
  },
  articleId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  softwareId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  photoId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  videoId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
});
const FeaturedModel = mongoose.model("Featured", mongoFeaturedSchema);

function validateId(val) {
  console.log(val, typeof val);
  if (typeof val === undefined || mongoose.Types.ObjectId.isValid(val)) return true;
  else throw new Error("Featured content (other than body) must be an id.");
}

//Joi Schema
const joiFeaturedSchema = Joi.object({
  body: Joi.string().min(2).required(),
  articleId: Joi.objectId().allow(null),
  softwareId: Joi.objectId().allow(null),
  photoId: Joi.objectId().allow(null),
  videoId: Joi.objectId().allow(null),
});

exports.FeaturedModel = FeaturedModel;
exports.joiSchema = joiFeaturedSchema;
