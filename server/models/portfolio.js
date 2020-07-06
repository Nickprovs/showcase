const { mongoSchema, joiSchema } = require("./common/article");
const mongoose = require("mongoose");

//Portfolio objects are just articles that go in a seperate collection
const Portfolio = mongoose.model("Portfolio", mongoSchema);

exports.Portfolio = Portfolio;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
