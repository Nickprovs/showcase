const express = require("express");
const blogs = require("../routes/blogs");

module.exports = function(app) {
  app.use("/blogs", blogs);
};
