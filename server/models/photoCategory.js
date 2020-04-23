const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const PhotoCategoryModel = mongoose.model("PhotoCategory", mongoSchema);

exports.PhotoCategoryModel = PhotoCategoryModel;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
