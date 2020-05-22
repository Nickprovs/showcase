const { User, joiSchema } = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth(), async (req, res) => {
  let user = await User.findOne({ username: req.user.username }).select("-password -mfaCode");
  res.send(user);
});

module.exports = router;
