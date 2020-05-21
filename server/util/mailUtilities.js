const nodemailer = require("nodemailer");
const config = require("config");

//Nodemailer Transport
const transporter = nodemailer.createTransport({
  host: config.get("smtpHost"),
  port: config.get("smtpPort"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.get("smtpAuthUsername"),
    pass: config.get("smtpAuthPassword"),
  },
});

module.exports = class MailUtilities {
  static async sendMailOrThrow(to, subject, text) {
    await transporter.sendMail({
      from: `"${config.get("smtpDisplayUsername")}" <${config.get("smtpAuthUsername")}>`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    });
  }
};
