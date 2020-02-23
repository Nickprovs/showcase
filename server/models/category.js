const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//Mongo Schema
const mongoCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  }
});
const Category = mongoose.model("Category", mongoCategorySchema);

//Public Schema - Joi
const schema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
});

exports.Category = Category;
exports.schema = schema;
exports.mongoSchema = mongoCategorySchema;
