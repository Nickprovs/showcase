let cors = require("cors");
const config = require("config");
const portFormatted = config.get("clientPort") ? `:${config.get("clientPort")}` : "";

module.exports = function (app) {
  app.use(
    //Notes:
    //Origin could be specified as [Address] | * where all credential (cookie) based requests must come from address...
    //...but non cookie based requests can come from anywhere.
    cors({
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
      preflightContinue: true,
      credentials: true,
      origin: `${config.get("clientProtocol")}://${config.get("clientAddress")}${portFormatted}`,
    })
  );
};
