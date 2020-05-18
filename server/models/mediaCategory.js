const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const MediaCategoryModel = mongoose.model("MediaCategory", mongoSchema);

exports.MediaCategoryModel = MediaCategoryModel;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
