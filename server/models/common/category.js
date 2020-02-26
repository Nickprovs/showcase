const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//Mongo Schema
const mongoCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  }
});

//Public Schema - Joi
const joiCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
});

exports.joiSchema = joiCategorySchema;
exports.mongoSchema = mongoCategorySchema;
