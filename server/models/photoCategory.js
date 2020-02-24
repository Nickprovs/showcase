const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//Mongo Schema
const mongoPhotoCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  }
});
const PhotoCategory = mongoose.model("PhotoCategory", mongoPhotoCategorySchema);

//Public Schema - Joi
const joiPhotoCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
});

exports.PhotoCategory = PhotoCategory;
exports.joiSchema = joiPhotoCategorySchema;
exports.mongoSchema = mongoPhotoCategorySchema;
