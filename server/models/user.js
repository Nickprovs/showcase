const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//From back to front:
const hourInMillis = 60 * 60 * 1000;

const mfaCodeSchema = {
  code: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 64,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
};

const mongoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  mfaCode: {
    type: mfaCodeSchema,
    required: false,
  },
  isAdmin: Boolean,
});

mongoSchema.methods.generateAuthToken = function (customClaims, expiryTimeInMillis = 2 * hourInMillis) {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isAdmin: this.isAdmin,
      ...customClaims,
    },
    config.get("tokenPrivateKey"),
    { expiresIn: `${expiryTimeInMillis}ms` }
  );
  return token;
};

const User = mongoose.model("User", mongoSchema);

// transform for sending as json
function omitPrivate(doc, obj) {
  delete obj.__v;
  delete obj.password;
  delete obj.mfaCode;
  return obj;
}
mongoSchema.set("toJSON", { virtuals: false, transform: omitPrivate });

const joiSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(5).max(255).required(),
});

exports.User = User;
exports.mongoSchema = mongoSchema;
exports.joiSchema = joiSchema;
