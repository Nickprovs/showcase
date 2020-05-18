const { mongoSchema, joiSchema } = require("./common/article");
const mongoose = require("mongoose");

const Blog = mongoose.model("Blog", mongoSchema);

exports.Blog = Blog;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
