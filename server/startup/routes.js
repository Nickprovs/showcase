const express = require("express");
const auth = require("../routes/auth");
const articles = require("../routes/articles");
const photos = require("../routes/photos");
const videos = require("../routes/videos");

module.exports = function(app) {
  app.use("/auth", auth);
  app.use("/articles", articles);
  app.use("/photos", photos);
  app.use("/videos", videos);
};
