const config = require("config");

module.exports = function () {
  if (!config.has("clientProtocol")) throw new Error("Client Protocol must be set as environment variable: showcase_clientProtocol");
  if (!config.has("clientAddress")) throw new Error("Client Address must be set as environment variable: showcase_clientAddress");
  if (!config.has("clientPort")) throw new Error("Client Port must be set as environment variable: showcase_clientPort");
  if (!config.has("adminUsername")) throw new Error("Admin Username must be set as environment variable: showcase_adminUsername");
  if (!config.has("adminPassword")) throw new Error("Admin Password must be set as environment variable: showcase_adminPassword");
  if (!config.has("db")) throw new Error("Database address must be set as environment variable: showcase_db");
  if (!config.has("jwtPrivateKey")) throw new Error("JWT private key must be set as environment variable: showcase_jwtPrivateKey");
};
