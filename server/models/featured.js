const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const subSchema = {
  id: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  type: {
    type: String,
    required: false,
    enum: ["blog", "software", "photo", "media"],
  },
  dateLastModified: {
    type: Date,
    required: true,
    default: Date.now,
  },
};

//Mongo Schema
const mongoFeaturedSchema = new mongoose.Schema({
  primary: {
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
  },
  sub1: subSchema,
  sub2: subSchema,
});
const FeaturedModel = mongoose.model("Featured", mongoFeaturedSchema);

function validateId(val) {
  console.log(val, typeof val);
  if (typeof val === undefined || mongoose.Types.ObjectId.isValid(val)) return true;
  else throw new Error("Featured content (other than body) must be an id.");
}

//Joi Schema
const joiSubSchema = Joi.object({
  id: Joi.objectId().allow(null),
  type: Joi.string().valid("software", "blog", "photo", "medium").allow(null),
});

const joiFeaturedSchema = Joi.object({
  primary: Joi.object({
    markup: Joi.string().min(2),
  }),
  sub1: joiSubSchema,
  sub2: joiSubSchema,
});

exports.FeaturedModel = FeaturedModel;
exports.joiSchema = joiFeaturedSchema;
