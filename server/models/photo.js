const { mongoSchema, joiSchema } = require("./common/media");
const mongoose = require("mongoose");

const Photo = mongoose.model("Photo", mongoSchema);

exports.Photo = Photo;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
