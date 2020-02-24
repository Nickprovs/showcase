const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//Mongo Schema
const mongoVideoCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  }
});
const VideoCategory = mongoose.model("VideoCategory", mongoVideoCategorySchema);

//Public Schema - Joi
const joiVideoCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
});

exports.VideoCategory = VideoCategory;
exports.joiSchema = joiVideoCategorySchema;
exports.mongoSchema = mongoVideoCategorySchema;
