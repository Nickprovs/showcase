const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");

module.exports = (authType = config.get("authType")) => {
  return (req, res, next) => {
    const token = req.header("x-auth-token") ? req.header("x-auth-token") : req.cookies.showcase_accessToken;
    if (!token) return res.status(401).send("Access denied. No token provided.");

    let decoded = null;
    try {
      decoded = jwt.verify(token, config.get("tokenPrivateKey"));
      req.user = decoded;
    } catch (ex) {
      return res.status(400).send("Invalid token.");
    }

    if (authType === "MFA") {
      if (!decoded.completedChallenges.includes("credentials") || !decoded.completedChallenges.includes("emailMfa"))
        return res.status(400).send("Invalid token.");
    }
    next();
  };
};
