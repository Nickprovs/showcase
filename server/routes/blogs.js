const express = require("express");
const moment = require("moment");
const { Blog, schema: blogSchema } = require("../models/blog");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/blogs/getAllQuery");
const winston = require("winston");
const router = express.Router();

router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
  const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const total = await Blog.count({});

  const blogs = await Blog.find()
    .select("-__v -body")
    .sort({ datePosted: dateOrder })
    .skip(offset)
    .limit(limit);

  const data = {
    offset: offset,
    limit: limit,
    dateOrder: dateOrder,
    total: total,
    items: blogs
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const blog = await Blog.findById(req.params.id).select("-__v");
  if (!blog) return res.status(404).send("The blog with the given ID was not found.");

  res.send(blog);
});

router.post("/", [auth, admin, validateBody(blogSchema)], async (req, res) => {
  let blog = new Blog({
    uri: req.body.uri,
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

router.put("/:id", [auth, admin, validateObjectId, validateBody(blogSchema)], async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      uri: req.body.uri,
      title: req.body.title,
      previewText: req.body.previewText,
      previewImageSource: req.body.previewImageSource,
      body: req.body.body,
      dateLastModified: moment().toJSON()
    },
    { new: true }
  );

  if (!updatedBlog) return res.status(404).send("Blog not found.");

  res.send(updatedBlog);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const blog = await Blog.findByIdAndRemove(req.params.id);
  if (!blog) return res.status(404).send("The blog with the given ID was not found.");

  res.send(blog);
});

module.exports = router;
