const express = require("express");
const auth = require("../routes/auth");
const articleCategories = require("../routes/articleCategories");
const articles = require("../routes/articles");
const photoCategories = require("../routes/photoCategories");
const photos = require("../routes/photos");
const videoCategories = require("../routes/videoCategories");
const videos = require("../routes/videos");

module.exports = function(app) {
  app.use("/auth", auth);

  app.use("/articles", articles);
  app.use("/articleCategories", articleCategories);

  app.use("/photos", photos);
  app.use("/photoCategories", photoCategories);

  app.use("/videos", videos);
  app.use("/videoCategories", videoCategories);
};
