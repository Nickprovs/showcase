const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

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

mongoSchema.methods.generateAuthToken = function (customClaims) {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isAdmin: this.isAdmin,
      ...customClaims,
    },
    config.get("tokenPrivateKey"),
    { expiresIn: "1h" }
  );
  return token;
};

const User = mongoose.model("User", mongoSchema);

const joiSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(5).max(255).required(),
});

exports.User = User;
exports.mongoSchema = mongoSchema;
exports.joiSchema = joiSchema;
