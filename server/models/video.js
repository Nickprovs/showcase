const { mongoSchema, joiSchema } = require("./common/media");
const mongoose = require("mongoose");

const Video = mongoose.model("Video", mongoSchema);

exports.Video = Video;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
