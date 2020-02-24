const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const ArticleCategory = mongoose.model("ArticleCategory", mongoSchema);

exports.ArticleCategory = ArticleCategory;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
