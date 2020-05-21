const StringUtilities = require("./stringUtilities");
const moment = require("moment");

module.exports = class AuthUtilities {
  static getMfaCodeObject() {
    const mfaCode = StringUtilities.generateRandomUppercaseAlphaNumericString(6);
    const mfaCodeExpiresAt = moment().add("10", "minutes").toJSON();
    return {
      code: mfaCode,
      expiresAt: mfaCodeExpiresAt,
    };
  }
};
