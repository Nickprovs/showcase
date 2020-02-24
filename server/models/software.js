const { mongoSchema, joiSchema } = require("./common/article");
const mongoose = require("mongoose");

//Software objects are just articles that go in a seperate collection
const Software = mongoose.model("Software", mongoSchema);

exports.Software = Software;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
