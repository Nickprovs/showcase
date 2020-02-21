const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//Mongo Schema
const mongoSoftwareSchema = new mongoose.Schema({
  uri: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 128
  },
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 64
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128
  },
  datePosted: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateLastModified: {
    type: Date,
    required: true,
    default: Date.now
  },
  image: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000
  },
  body: {
    type: String,
    minlength: 2,
    required: true
  }
});
mongoSoftwareSchema.set("toJSON", { virtuals: false });
const Software = mongoose.model("Software", mongoSoftwareSchema);

//Public Schema - Joi
const schema = Joi.object({
  uri: Joi.string()
    .min(2)
    .max(128)
    .required(),
  title: Joi.string()
    .min(2)
    .max(64)
    .required(),
  description: Joi.string()
    .min(2)
    .max(128)
    .required(),
  image: Joi.string()
    .min(2)
    .max(1000)
    .required(),
  body: Joi.string()
    .min(2)
    .required()
});

exports.Software = Software;
exports.schema = schema;
