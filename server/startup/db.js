const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const dbConnectionString = config.get("dbConnectionString");
  // Make Mongoose use MongoDB's newer `findOneAndUpdate()`. Note that this option is `true`
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => winston.info(`Connected to ${dbConnectionString}...`));
};
