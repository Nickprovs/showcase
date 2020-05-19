const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User, joiSchema } = require("../models/user");
const express = require("express");
const router = express.Router();
const validateBody = require("../middleware/validateBody");
const auth = require("../middleware/auth");
const config = require("config");
const captchaSecret = config.get("captchaSecret");
const fetch = require("node-fetch");
const authBodyJoiSchema = require("./schemas/body/auth/post");

router.post("/", validateBody(authBodyJoiSchema), async (req, res) => {
  //Validate the captcha
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

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid username or password.");

  const accessToken = user.generateAuthToken();

  let cookieOptions = { sameSite: "lax", httpOnly: false };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", accessToken, cookieOptions);

  res.send({ accessToken });
});

router.delete("/", auth, async (req, res) => {
  let cookieOptions = { sameSite: "lax", httpOnly: false, expires: new Date(Date.now()) };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("showcase_accessToken", "logged out", cookieOptions);
  res.send();
});

module.exports = router;
