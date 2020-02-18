const express = require("express");
const moment = require("moment");
const { Blog, validate: validateBlog } = require("../models/blog");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validator = require("../middleware/validate");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const blogs = await Blog.find()
    .select("-__v")
    .sort("title");
  res.send(blogs);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const blog = await Blog.findById(req.params.id).select("-__v");
  if (!blog) return res.status(404).send("The blog with the given ID was not found.");

  res.send(blog);
});

router.post("/", [auth, admin, validator(validateBlog)], async (req, res) => {
  let blog = new Blog({
    title: req.body.title,
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    previewText: req.body.previewText,
    previewImageSource: req.body.previewImageSource,
    body: req.body.body
  });

  blog = await blog.save();

  res.send(blog);
});

module.exports = router;
