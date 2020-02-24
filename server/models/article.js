const { mongoSchema, joiSchema } = require("./common/article");
const mongoose = require("mongoose");

const Article = mongoose.model("Article", mongoSchema);

exports.Article = Article;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
