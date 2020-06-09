const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { mongoSchema: categorySchema } = require("./common/category");

//Mongo Schema
const addressableHighlightSchema = {
  label: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 24,
  },
  address: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
};

const mongoPhotoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 64,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
  },
  datePosted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateLastModified: {
    type: Date,
    required: true,
    default: Date.now,
  },
  orientation: {
    type: String,
    required: true,
    enum: ["square", "landscape", "panorama", "portrait", "vertorama"],
  },
  displaySize: {
    type: String,
    required: true,
    enum: ["small", "medium", "large"],
  },
  source: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000,
  },
  addressableHighlights: {
    type: [addressableHighlightSchema],
    required: false,
    _id: false,
  },
  tags: {
    type: [String],
    required: true,
    validate: validateTags,
  },
});
mongoPhotoSchema.index({ title: "text", description: "text", tags: "text", "category.name": "text" });

function validateTags(val) {
  if (val.length >= 3 && val.length <= 10) return true;
  else throw new Error("Tags must contain between 3 and 10 entries.");
}

// transform for sending as json
function omitPrivate(doc, obj) {
  delete obj.__v;
  return obj;
}
mongoPhotoSchema.set("toJSON", { virtuals: false, transform: omitPrivate });

const PhotoModel = mongoose.model("Photo", mongoPhotoSchema);

//Joi Schema
const joiAddressableHighlightSchema = Joi.object().keys({
  label: Joi.string().required().min(2).max(24),
  address: Joi.string().required().min(2).max(1024),
});

const joiPhotoSchema = Joi.object({
  title: Joi.string().min(2).max(64).required(),
  categoryId: Joi.objectId().required(),
  description: Joi.string().min(2).max(128).required(),
  orientation: Joi.string().valid("square", "landscape", "panorama", "portrait", "vertorama").required(),
  displaySize: Joi.string().valid("small", "medium", "large").required(),
  source: Joi.string().min(2).max(1000).required(),
  addressableHighlights: Joi.array().items(joiAddressableHighlightSchema).min(0).max(3),
  tags: Joi.array().items(Joi.string()).min(3).max(10),
});

exports.PhotoModel = PhotoModel;
exports.joiSchema = joiPhotoSchema;
