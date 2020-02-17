const express = require("express");
const moment = require("moment");
const { Blog, validate } = require("../models/blog");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello!");
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
