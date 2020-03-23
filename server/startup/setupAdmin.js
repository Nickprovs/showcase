const { User } = require("../models/user");
const config = require("config");
const bcrypt = require("bcrypt");

module.exports = async function() {
  let adminUsername = config.get("adminUsername");
  let adminPassword = config.get("adminPassword");

  let existingAdmin = await User.findOne({ isAdmin: true });
  const salt = await bcrypt.genSalt(10);

  if (existingAdmin) {
    existingAdmin.username = adminUsername;
    existingAdmin.password = await bcrypt.hash(adminPassword, salt);
    await existingAdmin.save();
  } else {
    const admin = new User({
      username: adminUsername,
      password: await bcrypt.hash(adminPassword, salt),
      isAdmin: true
    });
    await admin.save();
  }
};
