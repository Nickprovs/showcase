const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//Mongo Schema
const mongoArticleCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  }
});
const ArticleCategory = mongoose.model("ArticleCategory", mongoArticleCategorySchema);

//Public Schema - Joi
const schema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
});

exports.ArticleCategory = ArticleCategory;
exports.schema = schema;
exports.mongoSchema = mongoArticleCategorySchema;
