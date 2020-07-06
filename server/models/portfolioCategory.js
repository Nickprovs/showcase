const mongoose = require("mongoose");
const { joiSchema, mongoSchema } = require("./common/category");

const PortfolioCategory = mongoose.model("PortfolioCategory", mongoSchema);

exports.PortfolioCategory = PortfolioCategory;
exports.joiSchema = joiSchema;
exports.mongoSchema = mongoSchema;
