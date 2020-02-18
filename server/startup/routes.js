const express = require("express");
const auth = require("../routes/auth");
const blogs = require("../routes/blogs");
const software = require("../routes/software");
const photos = require("../routes/photos");
const videos = require("../routes/videos");

module.exports = function(app) {
  app.use("/auth", auth);
  app.use("/blogs", blogs);
  app.use("/software", software);
  app.use("/photos", photos);
  app.use("/videos", videos);
};
