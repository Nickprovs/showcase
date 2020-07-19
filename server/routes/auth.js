const bcrypt = require("bcrypt");
const { User, joiSchema } = require("../models/user");
const express = require("express");
const router = express.Router();
const validateBody = require("../middleware/validateBody");
const auth = require("../middleware/auth");
const config = require("config");
const authCredentialsBodyJoiSchema = require("./schemas/body/auth/postCredentials");
const authEmailMfaBodyJoiSchema = require("./schemas/body/auth/postEmailMfa");
const StringUtilities = require("../util/stringUtilities");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const validateBodyCaptchaAsync = require("../middleware/validateBodyCaptchaAsync");
const MailUtilities = require("../util/mailUtilities");
const AuthUtilities = require("../util/authUtilities");

//From back to front:
const hourInMillis = 60 * 60 * 1000;
const sfaTokenExpiryTime = 2 * hourInMillis;
const mfaTokenExpiryTime = 4 * hourInMillis;

router.post("/credentials", validateBody(authCredentialsBodyJoiSchema), validateBodyCaptchaAsync(config.get("captchaPrivateKey")), async (req, res) => {
  //Validate the user's credentials
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password.");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid username or password.");

  //Generate an access token and set as cookie
  const accessToken = user.generateAuthToken({ completedChallenges: ["credentials"] }, sfaTokenExpiryTime);
  let cookieOptions = { sameSite: "lax", httpOnly: true, expires: false, maxAge: sfaTokenExpiryTime, domain: config.get("domain") };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", accessToken, cookieOptions);

  //In we're using single-factor auth -- we're done
  if (config.get("authType") === "SFA") return res.send({ token: accessToken, authComplete: true });

  //Otherwise -- continue with multi-factor auth and send the user a code to their email
  let mfaCodeObj = AuthUtilities.getMfaCodeObject();
  user.mfaCode = mfaCodeObj;
  await user.save();
  try {
    MailUtilities.sendMailOrThrow(config.get("adminEmail"), "Showcase Auth", `Your auth code is: ${mfaCodeObj.code}.`);
  } catch (ex) {
    console.log("ERROR SENDING MAIL", ex);
    return res.send(ex.message);
  }
  res.send({ token: accessToken, authComplete: false });
});

router.post("/emailMfa", auth("SFA"), validateBody(authEmailMfaBodyJoiSchema), async (req, res) => {
  //Existing decoded token validated from SFA Auth.
  const decoded = req.user;

  //Get the db user associated with the token and validate their mfa code
  let user = await User.findOne({ _id: decoded._id });
  if (!user) return res.status(400).send("Invalid token.");
  if (!user.mfaCode) return res.status(400).send("Invalid token.");
  if (moment().isAfter(user.mfaCode.expiresAt)) return res.status(400).send("Email Code Expired.");
  if (req.body.emailCode.toUpperCase() !== user.mfaCode.code.toUpperCase()) return res.status(400).send("Invalid Email Code.");

  //Reset their mfa code
  user.mfaCode = null;
  await user.save();

  //Add email to their completed challenges in a refreshed token.
  decoded.completedChallenges.push("emailMfa");
  const accessToken = user.generateAuthToken({ completedChallenges: decoded.completedChallenges }, mfaTokenExpiryTime);
  let cookieOptions = { sameSite: "lax", httpOnly: true, expires: false, maxAge: mfaTokenExpiryTime, domain: config.get("domain") };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", accessToken, cookieOptions);
  res.send({ token: accessToken, authComplete: true });
});

router.delete("/", auth(), async (req, res) => {
  let cookieOptions = { sameSite: "lax", httpOnly: true, expires: false, maxAge: 0, domain: config.get("domain") };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", "logged out", cookieOptions);
  res.send();
});

module.exports = router;
