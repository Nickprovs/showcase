const winston = require("winston");
const express = require("express");
const config = require("config");
const error = require("./middleware/error");
const app = express();

require("./startup/logging")();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./startup/routes")(app);
app.use(error);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
