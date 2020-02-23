const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { mongoSchema: mongoCategorySchema } = require("./category");

//Mongo Schema
const mongoBlogSchema = new mongoose.Schema({
  slug: {
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
  category: {
    type: mongoCategorySchema,
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
  },
  tags: {
    type: [String],
    required: true,
    validate: validateTags
  },
  contingency: {
    type: Map,
    of: String,
    validate: validateContingency
  }
});
function validateTags(val) {
  if (val.length >= 3 && val.length <= 10) return true;
  else throw new Error("Tags must contain between 3 and 10 entries.");
}

function validateContingency(map) {
  const keys = Array.from(map.keys());

  if (keys.length > 10) throw new Error("Contingency should have a max of 10 keys. Don't abuse it!");

  for (const key of keys) {
    if (key.length > 100) throw new Error("Can't store a key with more than 100 characters");
  }

  for (const value of map.values()) {
    if (value.length > 1000) throw new Error("Can't store a contingency value with more than 1000 characters");
  }
  return true;
}

mongoBlogSchema.set("toJSON", { virtuals: false });
const Blog = mongoose.model("Blog", mongoBlogSchema);

//Public Schema - Joi
const schema = Joi.object({
  slug: Joi.string()
    .min(2)
    .max(128)
    .required(),
  title: Joi.string()
    .min(2)
    .max(64)
    .required(),
  categoryId: Joi.objectId().required(),
  description: Joi.string()
    .min(2)
    .max(128)
    .required(),
  category: Joi.string()
    .min(2)
    .max(64)
    .required(),
  image: Joi.string()
    .min(2)
    .max(1000)
    .required(),
  body: Joi.string()
    .min(2)
    .required(),
  tags: Joi.array()
    .items(Joi.string())
    .min(3)
    .max(10),
  contingency: Joi.object().pattern(Joi.string(), Joi.string())
});

exports.Blog = Blog;
exports.schema = schema;
