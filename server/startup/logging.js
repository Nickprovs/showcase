const winston = require("winston");
// require('winston-mongodb');
// require('express-async-errors');

module.exports = function() {
  const consoleTransport = new winston.transports.Console({ colorize: true, prettyPrint: true });
  const fileTransport = new winston.transports.File({ filename: "log.log" });

  winston.exceptions.handle(consoleTransport, fileTransport);

  process.on("unhandledRejection", ex => {
    throw ex;
  });

  winston.add(fileTransport, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/vidly',
  //   level: 'info'
  // });
};
