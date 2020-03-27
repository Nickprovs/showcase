const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User, joiSchema } = require("../models/user");
const express = require("express");
const router = express.Router();
const validateBody = require("../middleware/validateBody");

router.post("/", validateBody(joiSchema), async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid username or password.");

  console.log(req.cookies);

  const accessToken = user.generateAuthToken();

  let cookieOptions = { sameSite: "lax", httpOnly: true };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("nickprovs_accessToken", accessToken, cookieOptions);

  res.send({ accessToken });
});

module.exports = router;
