const config = require("config");

module.exports = function () {
  if (!config.has("recognizedClients")) throw new Error("Recognized Clients must be set as environment variable: RECOGNIZED_CLIENTS");
  if (!config.has("adminUsername")) throw new Error("Admin Username must be set as environment variable: ADMIN_USERNAME");
  if (!config.has("adminPassword")) throw new Error("Admin Password must be set as environment variable: ADMIN_PASSWORD");
  if (!config.has("adminEmail")) throw new Error("Admin Email must be set as environment variable: ADMIN_EMAIL");
  if (!config.has("smtpHost")) throw new Error("SMTP Host must be set as environment variable: SMTP_HOST");
  if (!config.has("smtpPort")) throw new Error("SMTP Port must be set as environment variable: SMTP_PORT");
  if (!config.has("smtpDisplayUsername")) throw new Error("SMTP Display Username must be set as environment variable: SMTP_DISPLAY_USERNAME");
  if (!config.has("smtpAuthUsername")) throw new Error("SMTP Auth Username must be set as environment variable: SMTP_AUTH_USERNAME");
  if (!config.has("smtpAuthPassword")) throw new Error("SMTP Auth PAssword must be set as environment variable: SMTP_AUTH_PASSWORD");
  if (!config.has("smtpReceiverEmail")) throw new Error("SMTP Receiver Email must be set as environment variable: SMTP_RECEIVER_EMAIL");
  if (!config.has("port")) throw new Error("Port must be set as environment variable: PORT");
  if (!config.has("tokenPrivateKey")) throw new Error("Token Private Key must be set as environment variable: TOKEN_PRIVATE_KEY");
  if (!config.has("captchaPrivateKey")) throw new Error("Captcha Private Key must be set as environment variable: CAPTCHA_PRIVATE_KEY");
  if (!config.has("dbConnectionString")) throw new Error("Database connection string must be set as environment variable: DB_CONNECTION_STRING");
  if (!config.has("authType")) throw new Error("Auth Type must be set as environment variable: AUTH_TYPE");
  if (!config.has("recognizedMarkupDomains")) throw new Error("Trusted Domains must be set as environment variable: RECOGNIZED_MARKUP_DOMAINS");

  if (config.get("authType") !== "SFA" && config.get("authType") !== "MFA") throw new Error(`Auth Type in environment must be specified as "SFA" or "MFA"`);
};
