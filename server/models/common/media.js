const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { mongoSchema: categorySchema } = require("./category");

//Mongo Schema
const mongoMediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 64
  },
  category: {
    type: categorySchema,
    required: true
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
  },
  tags: {
    type: [String],
    required: true,
    validate: validateTags
  }
});
mongoMediaSchema.index({ title: "text", tags: "text", "category.name": "text" });

function validateTags(val) {
  if (val.length >= 3 && val.length <= 10) return true;
  else throw new Error("Tags must contain between 3 and 10 entries.");
}

mongoMediaSchema.set("toJSON", { virtuals: false });

//Joi Schema
const joiMediaSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(64)
    .required(),
  categoryId: Joi.objectId().required(),
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
    .required(),
  tags: Joi.array()
    .items(Joi.string())
    .min(3)
    .max(10)
});

exports.joiSchema = joiMediaSchema;
exports.mongoSchema = mongoMediaSchema;
