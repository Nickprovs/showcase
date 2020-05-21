const winston = require("winston");
const fetch = require("node-fetch");

module.exports = (captchaSecret) => {
  return async (req, res, next) => {
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
        return res.status(400).send(`Captcha not valid. Reason - ${reason}`);
      }
    } catch (ex) {
      console.log("ERROR VALIDATING CAPTCHA", ex);
      return res.status(500).send(`Error validating captcha - ${ex.message}`);
    }
    next();
  };
};
