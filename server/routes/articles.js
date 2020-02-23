const express = require("express");
const moment = require("moment");
const { Article, schema: articleSchema } = require("../models/article");
const { ArticleCategory } = require("../models/articleCategory");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/articles/getAllQuery");
const winston = require("winston");
const router = express.Router();

router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
  const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  //Todo... this total should be affected by the category if user passes category.
  const total = await Article.count({});

  const articles = await Article.find()
    .select("-__v -body")
    .sort({ datePosted: dateOrder })
    .skip(offset)
    .limit(limit);

  const data = {
    offset: offset,
    limit: limit,
    dateOrder: dateOrder,
    total: total,
    items: articles
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const article = await Article.findById(req.params.id).select("-__v");
  if (!article) return res.status(404).send("The article with the given ID was not found.");

  res.send(article);
});

router.post("/", [auth, admin, validateBody(articleSchema)], async (req, res) => {
  const articleCategory = await ArticleCategory.findById(req.body.categoryId);
  if (!articleCategory) return res.status(400).send("Invalid article category.");

  let article = new Article({
    slug: req.body.slug,
    title: req.body.title,
    category: articleCategory,
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    description: req.body.description,
    image: req.body.image,
    body: req.body.body,
    tags: req.body.tags
  });

  article = await article.save();

  res.send(article);
});

router.put("/:id", [auth, admin, validateObjectId, validateBody(articleSchema)], async (req, res) => {
  const articleCategory = await ArticleCategory.findById(req.body.categoryId);
  if (!articleCategory) return res.status(400).send("Invalid article category.");

  const updatedArticle = await Article.findByIdAndUpdate(
    req.params.id,
    {
      slug: req.body.slug,
      title: req.body.title,
      category: articleCategory,
      dateLastModified: moment().toJSON(),
      description: req.body.description,
      image: req.body.image,
      body: req.body.body,
      tags: req.body.tags
    },
    { new: true }
  );

  if (!updatedArticle) return res.status(404).send("Article not found.");

  res.send(updatedArticle);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const article = await Article.findByIdAndRemove(req.params.id);
  if (!article) return res.status(404).send("The article with the given ID was not found.");

  res.send(article);
});

module.exports = router;
