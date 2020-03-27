let cors = require("cors");
const config = require("config");
module.exports = function(app) {
  app.use(
    //Notes:
    //Origin could be specified as [Address] | * where all credential (cookie) based requests must come from address...
    //...but non cookie based requests can come from anywhere.
    cors({
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      preflightContinue: true,
      credentials: true,
      origin: `${config.get("clientProtocol")}://${config.get("clientAddress")}:${config.get("clientPort")}`
    })
  );
};
