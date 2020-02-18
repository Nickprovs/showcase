const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64
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
  previewText: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128
  },
  previewImageSource: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000
  },
  body: {
    type: String,
    minlength: 2,
    required: true
  }
});

blogSchema.set("toJSON", { virtuals: false });
const Blog = mongoose.model("Blog", blogSchema);

function validateBlog(blog) {
  const schema = Joi.object({
    title: Joi.string()
      .min(2)
      .max(64)
      .required(),
    previewText: Joi.string()
      .min(2)
      .max(128)
      .required(),
    previewImageSource: Joi.string()
      .min(2)
      .max(1000)
      .required(),
    body: Joi.string()
      .min(2)
      .required()
  });

  return schema.validate(blog);
}

exports.Blog = Blog;
exports.validate = validateBlog;
