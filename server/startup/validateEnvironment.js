const config = require("config");

module.exports = function() {
  if (!config.has("adminUsername")) throw new Error("Admin Username must be set as environment variable: nickprovs_adminUsername");
  if (!config.has("adminPassword")) throw new Error("Admin Password must be set as environment variable: nickprovs_adminPassword");
  if (!config.has("db")) throw new Error("Database address must be set as environment variable: nickprovs_db");
  if (!config.has("jwtPrivateKey")) throw new Error("JWT private key must be set as environment variable: nickprovs_jwtPrivateKey");
};
