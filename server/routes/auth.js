const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User, joiSchema } = require("../models/user");
const express = require("express");
const router = express.Router();
const validateBody = require("../middleware/validateBody");
const auth = require("../middleware/auth");

router.post("/", validateBody(joiSchema), async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid username or password.");

  const accessToken = user.generateAuthToken();

  let cookieOptions = { sameSite: "lax", httpOnly: false };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("nickprovs_accessToken", accessToken, cookieOptions);

  res.send({ accessToken });
});

router.delete("/", auth, async (req, res) => {
  let cookieOptions = { sameSite: "lax", httpOnly: false, expires: new Date(Date.now())};
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("nickprovs_accessToken", "logged out", cookieOptions);
  res.send();
});


module.exports = router;
