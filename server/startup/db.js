const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
  const db = config.get("db");
  // Make Mongoose use MongoDB's newer `findOneAndUpdate()`. Note that this option is `true`
  mongoose.set("useFindAndModify", false);
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => winston.info(`Connected to ${db}...`));
};
