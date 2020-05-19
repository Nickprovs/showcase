const config = require("config");

module.exports = function () {
  if (!config.has("clientProtocol")) throw new Error("Client Protocol must be set as environment variable: CLIENT_PROTOCOL");
  if (!config.has("clientAddress")) throw new Error("Client Address must be set as environment variable: CLIENT_ADDRESS");
  if (!config.has("clientPort")) throw new Error("Client Port must be set as environment variable: CLIENT_PORT");
  if (!config.has("adminUsername")) throw new Error("Admin Username must be set as environment variable: ADMIN_USERNAME");
  if (!config.has("adminPassword")) throw new Error("Admin Password must be set as environment variable: ADMIN_PASSWORD");
  if (!config.has("adminEmail")) throw new Error("Admin Email must be set as environment variable: ADMIN_EMAIL");
  if (!config.has("smtpHost")) throw new Error("SMTP Host must be set as environment variable: SMTP_HOST");
  if (!config.has("smtpPort")) throw new Error("SMTP Port must be set as environment variable: SMTP_PORT");
  if (!config.has("smtpDisplayUsername"))
    throw new Error("SMTP Display Username must be set as environment variable: SMTP_DISPLAY_USERNAME");
  if (!config.has("smtpAuthUsername")) throw new Error("SMTP Display Username must be set as environment variable: SMTP_AUTH_USERNAME");
  if (!config.has("smtpAuthPassword")) throw new Error("SMTP Display Username must be set as environment variable: SMTP_AUTH_PASSWORD");
  if (!config.has("smtpReceiverEmail")) throw new Error("SMTP Display Username must be set as environment variable: SMTP_RECEIVER_EMAIL");
  if (!config.has("port")) throw new Error("Port must be set as environment variable: PORT");
  if (!config.has("tokenPrivateKey")) throw new Error("Token Private Key must be set as environment variable: TOKEN_PRIVATE_KEY");
  if (!config.has("captchaPrivateKey")) throw new Error("Captcha Private Key must be set as environment variable: CAPTCHA_PRIVATE_KEY");
  if (!config.has("dbConnectionString")) throw new Error("Captcha Private Key must be set as environment variable: DB_CONNECTION_STRING");
  if (!config.has("authType")) throw new Error("Captcha Private Key must be set as environment variable: AUTH_TYPE");

  if (config.get("authType") !== "SFA" && config("authType" !== "MFA"))
    throw new Error(`Auth Type in environment must be specified as "SFA" or "MFA"`);
};
