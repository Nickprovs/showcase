const express = require("express");
const router = express.Router();
const contactSchema = require("./schemas/body/contact/contact");
const config = require("config");
const validateBody = require("../middleware/validateBody");
const validateBodyCaptchaAsync = require("../middleware/validateBodyCaptchaAsync");
const MailUtilities = require("../util/mailUtilities");

router.post("/", validateBody(contactSchema), validateBodyCaptchaAsync(config.get("captchaPrivateKey")), async (req, res) => {
  try {
    MailUtilities.sendMailOrThrow(
      config.get("smtpReceiverEmail"),
      `Showcase Site Mail - ${req.body.name}`,
      `${req.body.message} \n\n - Reply To ${req.body.email}`
    );
  } catch (ex) {
    console.log("ERROR SENDING MAIL", ex);
    return res.send(ex.message);
  }

  res.status(200).send("Success!");
});

module.exports = router;
