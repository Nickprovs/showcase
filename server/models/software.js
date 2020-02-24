const mongoose = require("mongoose");
const { mongoSchema: mongoArticleSchema, joiSchema: joiArticleSchema } = require("./article");

//Software objects are just articles that go in a seperate collection
const Software = mongoose.model("Software", mongoArticleSchema);

exports.Software = Software;
exports.joiSchema = joiArticleSchema;
exports.mongoSchema = mongoArticleSchema;
