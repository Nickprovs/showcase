const ValidationUtilities = require("../util/validationUtilities");

//In this API, a variable id is one that is either...
//...a primary database id (mongo id) OR a slug.
//If a valid id is sent... this middleware stores which type of valid id was sent in the req.
module.exports = function(req, res, next) {
  const { isVariableId, isIdSlug } = ValidationUtilities.isVariableId(req.params.id);
  if (isVariableId) {
    req.isIdSlug = isIdSlug;
    return next();
  }
  return res.status(400).send("Invalid Database ID or Slug.");
};
