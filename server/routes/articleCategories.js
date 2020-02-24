const express = require("express");
const { ArticleCategory, joiSchema: articleCategorySchema } = require("../models/articleCategory");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateObjectId = require("../middleware/validateObjectId");
const winston = require("winston");
const router = express.Router();

router.get("/", async (req, res) => {
  const articleCategories = await ArticleCategory.find()
    .select("-__v")
    .sort({ name: "asc" });

  const total = await ArticleCategory.count({});
  const data = {
    total: total,
    items: articleCategories
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const articleCategory = await ArticleCategory.findById(req.params.id).select("-__v");
  if (!articleCategory) return res.status(404).send("The article category with the given ID was not found.");

  res.send(articleCategory);
});

router.post("/", [auth, admin, validateBody(articleCategorySchema)], async (req, res) => {
  let articleCategory = new ArticleCategory({
    name: req.body.name
  });

  articleCategory = await articleCategory.save();

  res.send(articleCategory);
});

router.put("/:id", [auth, admin, validateObjectId, validateBody(articleCategorySchema)], async (req, res) => {
  const updatedArticleCategory = await ArticleCategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  );

  if (!updatedArticleCategory) return res.status(404).send("Article Category not found.");

  res.send(updatedArticleCategory);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const articleCategory = await ArticleCategory.findByIdAndRemove(req.params.id);
  if (!articleCategory) return res.status(404).send("The article category with the given ID was not found.");

  res.send(articleCategory);
});

module.exports = router;
