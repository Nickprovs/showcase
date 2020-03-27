const winston = require("winston");
const express = require("express");
const cookieParser = require("cookie-parser");
const config = require("config");
const error = require("./middleware/error");
const app = express();

app.use(cookieParser());

require("./startup/cors")(app);
require("./startup/validateEnvironment")();
require("./startup/logging")();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(error);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);
require("./startup/validation")();
require("./startup/setupAdmin")();
require("./startup/routes")(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
