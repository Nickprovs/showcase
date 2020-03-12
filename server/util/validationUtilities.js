const mongoose = require("mongoose");

module.exports = class ValidationUtilities {
  static isSlug(inputString) {
    const regex = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$");
    const result = regex.test(inputString);
    return result;
  }

  static isVariableId(inputString) {
    if (mongoose.Types.ObjectId.isValid(inputString)) return { isVariableId: true, isIdSlug: false };
    if (ValidationUtilities.isSlug(inputString)) return { isVariableId: true, isIdSlug: true };

    return { isVariableId: false, isIdSlug: false };
  }
};
