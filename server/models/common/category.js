const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const ValidationUtilities = require("../../util/validationUtilities");

//Mongo Schema
const mongoCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
    validate: validateSlug
  }
});

function validateSlug(slug) {
  if (ValidationUtilities.isSlug(slug)) return true;
  else throw new Error("Slug must be a valid web-slug");
}

//Public Schema - Joi
const joiCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),
  slug: Joi.string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
});

exports.joiSchema = joiCategorySchema;
exports.mongoSchema = mongoCategorySchema;
