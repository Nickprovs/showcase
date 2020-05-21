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

router.post("/credentials", validateBody(authCredentialsBodyJoiSchema), validateBodyCaptchaAsync(config.get("captchaPrivateKey")), async (req, res) => {
  //Validate the user's credentials
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password.");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid username or password.");

  //Generate an access token and set as cookie
  const accessToken = user.generateAuthToken({ completedChallenges: ["credentials"] });
  let cookieOptions = { sameSite: "strict", httpOnly: true };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", accessToken, cookieOptions);

  //In we're using single-factor auth -- we're done
  if (config.get("authType") === "SFA") return res.send({ token: accessToken, authComplete: true });

  //Otherwise -- continue with multi-factor auth and send the user a code to their email
  user.mfaCode = AuthUtilities.getMfaCode();
  await user.save();
  try {
    MailUtilities.sendMailOrThrow(config.get("adminEmail"), "Showcase Auth", `Your auth code is: ${mfaCode}.`);
  } catch (ex) {
    console.log("ERROR SENDING MAIL", ex);
    return res.send(ex.message);
  }
  res.send({ token: accessToken, authComplete: false });
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
