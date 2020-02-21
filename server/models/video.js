const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//Mongo Schema
const mongoVideoSchema = new mongoose.Schema({
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
  orientation: {
    type: String,
    required: true,
    enum: ["square", "landscape", "panorama", "portrait", "vertorama"]
  },
  displaySize: {
    type: String,
    required: true,
    enum: ["small", "medium", "large"]
  },
  source: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000
  }
});
mongoVideochema.set("toJSON", { virtuals: false });
const Video = mongoose.model("Video", mongoVideochema);

//Public Schema - Joi
const schema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(64)
    .required(),
  description: Joi.string()
    .min(2)
    .max(128)
    .required(),
  orientation: Joi.string()
    .valid("square", "landscape", "panorama", "portrait", "vertorama")
    .required(),
  displaySize: Joi.string()
    .valid("small", "medium", "large")
    .required(),
  source: Joi.string()
    .min(2)
    .max(1000)
    .required()
});

exports.Video = Video;
exports.schema = schema;
