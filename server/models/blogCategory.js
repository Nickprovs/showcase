const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const BlogCategory = mongoose.model("BlogCategory", mongoSchema);

exports.BlogCategory = BlogCategory;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
