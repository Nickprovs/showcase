const express = require("express");
const moment = require("moment");
const { Blog, validate } = require("../models/blog");
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

router.post("/", async (req, res) => {
  const blog = new Blog({
    title: "dogs",
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    previewText: "The dogiest of dogs.",
    previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
    body: "aadada"
  });

  console.log("about to save blog");
  await blog.save();
  console.log("saved blog!");
  res.sendStatus(200);
});

module.exports = router;
