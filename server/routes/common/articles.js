const express = require("express");
const moment = require("moment");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validateBody = require("../../middleware/validateBody");
const validateQuery = require("../../middleware/validateQuery");
const validateVariableId = require("../../middleware/validateVariableId");
const getAllQuerySchema = require("../schemas/queries/articles/getAllQuery");
const winston = require("winston");

module.exports = function(ArticleModel, articleJoiSchema, ArticleCategoryModel) {
  const router = express.Router();

  router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
    const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const categoryId = req.query.categoryId ? req.query.categoryId : "";
    const search = req.query.search ? req.query.search : "";

    const filterObject = {};

    //Build filter object if filterable query data was passed
    if (categoryId) {
      const articleCategory = await ArticleCategoryModel.findById(categoryId);
      if (!articleCategory) return res.status(400).send("Invalid article category in query.");

      filterObject["category"] = articleCategory;
    }

    if (search) {
      //Filters on all collection properties that have a text index
      //The double quotes aided by our escape character require...
      //...the predicate to have all words in the search (whitespace delimmited).
      const fuzzySearch = `\"${search}\"`;
      filterObject["$text"] = { $search: fuzzySearch };
    }

    //Get the total count that matches the filter object without pagination skipping / limiting
    const total = await ArticleModel.countDocuments(filterObject);

    //Get the paginated articles
    const articles = await ArticleModel.find(filterObject)
      .select("-__v -body")
      .sort({ datePosted: dateOrder })
      .skip(offset)
      .limit(limit);

    const data = {
      offset: offset,
      limit: limit,
      dateOrder: dateOrder,
      total: total,
      search: search,
      items: articles
    };

    res.send(data);
  });

  router.get("/:id", validateVariableId, async (req, res) => {
    let article;
    if (req.idIsSlug) article = await ArticleModel.find({ slug: req.params.id }).select("-__v");
    else article = await ArticleModel.findById(req.params.id).select("-__v");

    if (!article) return res.status(404).send("The article with the given ID or Slugwas not found.");
    res.send(article);
  });

  router.post("/", [auth, admin, validateBody(articleJoiSchema)], async (req, res) => {
    const articleCategory = await ArticleCategoryModel.findById(req.body.categoryId);
    if (!articleCategory) return res.status(400).send("Invalid article category.");

    let article = new ArticleModel({
      slug: req.body.slug,
      title: req.body.title,
      category: articleCategory,
      datePosted: moment().toJSON(),
      dateLastModified: moment().toJSON(),
      description: req.body.description,
      image: req.body.image,
      body: req.body.body,
      addressableHighlight: req.body.addressableHighlight,
      tags: req.body.tags,
      contingency: req.body.contingency ? req.body.contingency : {}
    });

    article = await article.save();

    res.send(article);
  });

  router.put("/:id", [auth, admin, validateVariableId, validateBody(articleJoiSchema)], async (req, res) => {
    const articleCategory = await ArticleCategoryModel.findById(req.body.categoryId);
    if (!articleCategory) return res.status(400).send("Invalid article category.");

    let filter;
    if (req.idIsSlug) filter = { slug: req.params.id };
    else filter = { _id: req.params.id };

    let updatedArticleModel = await ArticleModel.findOneAndUpdate(
      filter,
      {
        slug: req.body.slug,
        title: req.body.title,
        category: articleCategory,
        dateLastModified: moment().toJSON(),
        description: req.body.description,
        image: req.body.image,
        body: req.body.body,
        addressableHighlight: req.body.addressableHighlight,
        tags: req.body.tags,
        contingency: req.body.contingency
      },
      {
        new: true
      }
    );

    if (!updatedArticleModel) return res.status(404).send("The article with the given ID or Slug was not found.");

    res.send(updatedArticleModel);
  });

  router.delete("/:id", [auth, admin, validateVariableId], async (req, res) => {
    let filter;
    if (req.idIsSlug) filter = { slug: req.params.id };
    else filter = { _id: req.params.id };

    const article = await ArticleModel.findOneAndDelete(filter);
    if (!article) return res.status(404).send("The article with the given ID or Slug was not found.");

    res.send(article);
  });

  return router;
};
