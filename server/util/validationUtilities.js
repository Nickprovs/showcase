const mongoose = require("mongoose");

module.exports = class ValidationUtilities {
  static isSlug(inputString) {
    const regex = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$");
    const result = regex.test(inputString);
    return result;
  }

  static isVariableId(inputString) {
    if (this.isMongoId(inputString)) 
      return { isVariableId: true, isIdSlug: false };
    
    if (ValidationUtilities.isSlug(inputString)) return { isVariableId: true, isIdSlug: true };

    return { isVariableId: false, isIdSlug: false };
  }

  static isMongoId(inputString){
    //12 Char Special Case: Mongo reports valid id's for any string of length 12... 
    //... which isn't correct. This validation works in that case.
    if(inputString.length === 12)
      return new mongoose.Types.ObjectId(inputString).toString() === inputString;
    else
      return mongoose.Types.ObjectId.isValid(inputString);
  }
};
