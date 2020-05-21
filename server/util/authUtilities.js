const StringUtilities = require("./stringUtilities");
const moment = require("moment");

module.exports = class AuthUtilities {
  static getMfaCodeObject() {
    const mfaCode = StringUtilities.generateRandomUppercaseAlphaNumericString(8);
    const mfaCodeExpiresAt = moment().add("5", "minutes").toJSON();
    return {
      code: mfaCode,
      expiresAt: mfaCodeExpiresAt,
    };
  }
};
