const winston = require("winston");
const express = require("express");
const cookieParser = require("cookie-parser");
const config = require("config");
const error = require("./middleware/error");
const app = express();

app.use(cookieParser());
require("./startup/cors")(app);
require("./startup/validateEnvironment")();
const { setup: loggingSetup, teardown: loggingTeardown } = require("./startup/logging");
loggingSetup();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(error);
const { setup: dbSetup, teardown: dbTeardown} = require("./startup/db");
dbSetup();
require("./startup/prod")(app);
require("./startup/validation")();
require("./startup/setupAdmin")();
require("./startup/setupGeneral")();
require("./startup/setupFeatured")();
require("./startup/setupMarkupSanitizer")();
require("./startup/routes")(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

async function teardown() { 
    await dbTeardown();
    loggingTeardown();
    server.close();
}

module.exports = { server, teardown };