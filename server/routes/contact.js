const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const validateBody = require("../middleware/validateBody");
const contactSchema = require("./schemas/body/contact/contact");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const config = require("config");

const smtpInfo = config.get("smtp");
if (!smtpInfo.host || !smtpInfo.port || !smtpInfo.authUsername || !smtpInfo.authPassword)
  throw new Error("SMTP Info not all set in configuration.");
if (!smtpInfo.captchaSecret) throw new Error("Captcha Secret also needs to be set as part of smtpInfo");

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

router.post("/", validateBody(contactSchema), async (req, res) => {
  //Validate the captcha
  try {
    let captchaValidationRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${smtpInfo.captchaSecret}&response=${req.body.captcha}`,
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

  //Send mail
  //1.) From smtp credentials defined in config
  //2.) To receiver defined in config
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: `"${smtpInfo.displayUsername}" <${smtpInfo.authUsername}>`, // sender address
      to: `${smtpInfo.receiver}`, // list of receivers
      subject: `Showcase Site Mail - ${req.body.name}`, // Subject line
      text: `${req.body.message} \n\n - Reply To ${req.body.email}`, // plain text body
    });
  } catch (ex) {
    console.log("ERROR SENDING MAIL", ex);
    res.send(ex.message);
    return;
  }

  res.status(200).send("Success!");
});

module.exports = router;
