const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const SoftwareCategory = mongoose.model("SoftwareCategory", mongoSchema);

exports.SoftwareCategory = SoftwareCategory;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
