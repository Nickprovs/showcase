const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token") ? req.header("x-auth-token") : req.cookies.showcase_accessToken;
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("tokenPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
};
