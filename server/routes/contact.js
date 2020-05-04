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
  //Validate captcha from form to avoid spam
  console.log(req.body);
  try {
    let captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "post",
      body: JSON.stringify({
        secret: "1233",
        response: "123",
      }),
      headers: { "Content-Type": "application/json" },
    });
    console.log("captcha res", captchaRes.status);
  } catch (ex) {
    console.log("ERROR VALIDATING CAPTCHA", ex);
  }

  //Send mail
  //1.) From smtp credentials defined in config
  //2.) To receiver defined in config
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: `"${smtpInfo.displayUsername}" <${smtpInfo.authUsername}>`, // sender address
      to: `${smtpInfo.receiver}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  } catch (ex) {
    console.log("error sending mail", ex.message);
    res.send(ex.message);
    return;
  }

  res.status(200).send("Success!");
});

module.exports = router;
