const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const VideoCategoryModel = mongoose.model("VideoCategory", mongoSchema);

exports.VideoCategoryModel = VideoCategoryModel;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
