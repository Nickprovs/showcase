const mongoose = require("mongoose");
const ValidationUtilities = require("../util/validationUtilities");

//In this API, a variable id is one that is either...
//...a primary database id (mongo id) OR a slug.
//If a valid id is sent... this middleware stores which type of valid id was sent in the req.
module.exports = function(req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    req.idIsSlug = false;
    return next();
  }

  if (ValidationUtilities.IsSlug(req.params.id)) {
    req.idIsSlug = true;
    return next();
  }
  console.log("Invalid Id");
  return res.status(400).send("Invalid Database ID or Slug.");
};
