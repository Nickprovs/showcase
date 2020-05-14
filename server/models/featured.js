const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const subsidiarySchema = {
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["blog", "software", "photo", "media"],
  },
};

const primarySchema = {
  markup: {
    type: String,
    minlength: 2,
    required: true,
  },
  dateLastModified: {
    type: Date,
    required: true,
    default: Date.now,
  },
};

//Mongo Schema
const mongoFeaturedSchema = new mongoose.Schema({
  primary: primarySchema,
  subsidiaries: {
    items: {
      type: [subsidiarySchema],
      required: true,
      _id: false,
    },
    dateLastModified: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
});
const FeaturedModel = mongoose.model("Featured", mongoFeaturedSchema);

//Joi Schema
const joiSubsidiarySchema = Joi.object({
  id: Joi.objectId(),
  type: Joi.string().valid("software", "blog", "photo", "medium"),
});

const joiPrimarySchema = Joi.object({
  markup: Joi.string().min(2),
});

const joiFeaturedSchema = Joi.object({
  primary: joiPrimarySchema,
  subsidiaries: Joi.object({
    items: Joi.array().items(joiSubsidiarySchema).min(0).max(10).required(),
  }),
});

exports.FeaturedModel = FeaturedModel;
exports.joiFeaturedSchema = joiFeaturedSchema;
exports.joiSubsidiarySchema = joiSubsidiarySchema;
exports.joiPrimarySchema = joiPrimarySchema;
