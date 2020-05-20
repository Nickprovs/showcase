const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User, joiSchema } = require("../models/user");
const express = require("express");
const router = express.Router();
const validateBody = require("../middleware/validateBody");
const auth = require("../middleware/auth");
const config = require("config");
const fetch = require("node-fetch");
const authCredentialsBodyJoiSchema = require("./schemas/body/auth/postCredentials");
const authEmailMfaBodyJoiSchema = require("./schemas/body/auth/postEmailMfa");
const StringUtilities = require("../util/stringUtilities");
const nodemailer = require("nodemailer");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const getSmtpInfoFromConfig = () => {
  return {
    host: config.get("smtpHost"),
    port: config.get("smtpPort"),
    displayUsername: config.get("smtpDisplayUsername"),
    authUsername: config.get("smtpAuthUsername"),
    authPassword: config.get("smtpAuthPassword"),
    receiverEmail: config.get("smtpReceiverEmail"),
  };
};

const smtpInfo = getSmtpInfoFromConfig();
const captchaSecret = config.get("captchaPrivateKey");

if (!smtpInfo.host || !smtpInfo.port || !smtpInfo.authUsername || !smtpInfo.authPassword)
  throw new Error("SMTP Info not all set in configuration.");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: smtpInfo.host,
  port: smtpInfo.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: smtpInfo.authUsername, // generated ethereal user
    pass: smtpInfo.authPassword, // generated ethereal password
  },
});

router.post("/credentials", validateBody(authCredentialsBodyJoiSchema), async (req, res) => {
  //1.) Validate the captcha
  try {
    let captchaValidationRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${req.body.captcha}`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
      }
    );
    let captchaValidation = await captchaValidationRes.json();
    if (captchaValidation.success == false) {
      let reason = "error-codes" in captchaValidation ? captchaValidation["error-codes"].join(" ") : "Unknown";
      res.status(400).send(`Captcha not valid. Reason - ${reason}`);
      return;
    }
  } catch (ex) {
    console.log("ERROR VALIDATING CAPTCHA", ex);
    res.status(500).send(`Error validating captcha - ${ex.message}`);
  }

  //2.) Validate the User's credentials
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid username or password.");

  //3a) -- If Auth is set to Multi-Factor Authentication (MFA) -- Send The Admin an Email Code to further verification
  const accessToken = user.generateAuthToken({ completedChallenges: ["credentials"] });
  let cookieOptions = { sameSite: "strict", httpOnly: true };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", accessToken, cookieOptions);

  if (config.get("authType") === "MFA") {
    const mfaCode = StringUtilities.generateRandomUppercaseAlphaNumericString(6);
    const mfaCodeExpiresAt = moment().add("10", "minutes").toJSON();
    user.mfaCode = {
      code: mfaCode,
      expiresAt: mfaCodeExpiresAt,
    };

    await user.save();
    try {
      // send mail with defined transport object
      await transporter.sendMail({
        from: `"${smtpInfo.displayUsername}" <${smtpInfo.authUsername}>`, // sender address
        to: `${config.get("adminEmail")}`, // list of receivers
        subject: `Showcase Auth`, // Subject line
        text: `Your one time use code is: ${mfaCode}.`, // plain text body
      });
    } catch (ex) {
      console.log("ERROR SENDING MAIL", ex);
      res.send(ex.message);
      return;
    }
    res.send({ token: accessToken, authComplete: false });
  } else res.send({ token: accessToken, authComplete: true });
});

router.post("/emailMfa", validateBody(authEmailMfaBodyJoiSchema), async (req, res) => {
  const token = req.header("x-auth-token") ? req.header("x-auth-token") : req.cookies.showcase_accessToken;
  if (!token) return res.status(401).send("Access denied. No token provided.");
  let decoded = null;
  try {
    decoded = jwt.verify(token, config.get("tokenPrivateKey"));
  } catch (ex) {
    console.log(ex);
    return res.status(400).send("Invalid token.");
  }

  let user = await User.findOne({ _id: decoded._id });
  if (!user) return res.status(400).send("Invalid token.");
  if (!user.mfaCode) return res.status(400).send("Invalid token.");
  if (moment().isAfter(user.mfaCode.expiresAt)) return res.status(400).send("Email Code Expired.");
  if (req.body.emailCode.toUpperCase() !== user.mfaCode.code.toUpperCase()) return res.status(400).send("Invalid Email Code.");

  user.mfaCode = null;
  await user.save();

  decoded.completedChallenges.push("emailMfa");
  const accessToken = user.generateAuthToken({ completedChallenges: decoded.completedChallenges });
  let cookieOptions = { sameSite: "strict", httpOnly: true };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", accessToken, cookieOptions);
  res.send({ token: accessToken, authComplete: true });
});

router.delete("/", auth, async (req, res) => {
  let cookieOptions = { sameSite: "strict", httpOnly: true, expires: new Date(Date.now()) };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", "logged out", cookieOptions);
  res.send();
});

module.exports = router;
