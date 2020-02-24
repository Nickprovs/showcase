const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const PhotoCategory = mongoose.model("PhotoCategory", mongoSchema);

exports.PhotoCategory = PhotoCategory;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
