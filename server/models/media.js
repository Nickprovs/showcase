const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { mongoSchema: categorySchema } = require("./common/category");

//Mongo Schema
const mongoVideoSchema = new mongoose.Schema({
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
  markup: {
    type: String,
    required: true,
    minlength: 2,
  },
  tags: {
    type: [String],
    required: true,
    validate: validateTags,
  },
});
mongoVideoSchema.index({ title: "text", description: "text", tags: "text", "category.name": "text" });

function validateTags(val) {
  if (val.length >= 3 && val.length <= 10) return true;
  else throw new Error("Tags must contain between 3 and 10 entries.");
}

mongoVideoSchema.set("toJSON", { virtuals: false });

const VideoModel = mongoose.model("Video", mongoVideoSchema);

//Joi Schema
const joiVideoSchema = Joi.object({
  title: Joi.string().min(2).max(64).required(),
  categoryId: Joi.objectId().required(),
  description: Joi.string().min(2).max(128).required(),
  markup: Joi.string().min(2).required(),
  tags: Joi.array().items(Joi.string()).min(3).max(10),
});

exports.VideoModel = VideoModel;
exports.joiSchema = joiVideoSchema;
