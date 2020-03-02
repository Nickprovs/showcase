module.exports = class ValidationUtilities {
  static IsSlug(inputString) {
    const regex = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$");
    const result = regex.test(inputString);
    return result;
  }
};
