const express = require("express");
const moment = require("moment");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validateBody = require("../../middleware/validateBody");
const validateQuery = require("../../middleware/validateQuery");
const ValidationUtilities = require("../../util/validationUtilities");

const validateVariableId = require("../../middleware/validateVariableId");
const getAllQuerySchema = require("../schemas/queries/articles/getAllQuery");
const winston = require("winston");
const { FeaturedModel } = require("../../models/featured");

module.exports = function (ArticleModel, articleJoiSchema, ArticleCategoryModel, typeName) {
  const router = express.Router();

  router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
    const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const categoryId = req.query.category ? req.query.category : "";
    const search = req.query.search ? req.query.search : "";

    //Build filter object if filterable query data was passed
    const filterObject = {};

    if (categoryId) {
      let articleCategory;
      const { isIdSlug } = ValidationUtilities.isVariableId(categoryId);

      if (isIdSlug) articleCategory = await ArticleCategoryModel.findOne({ slug: categoryId }).select("-__v");
      else articleCategory = await ArticleCategoryModel.findById(categoryId);

      if (!articleCategory) return res.status(400).send("Invalid article category in query.");
      filterObject["category._id"] = articleCategory._id;
    }

    if (search) {
      const searchArray = [];
      searchArray.push({ $text: { $search: search } });
      filterObject["$or"] = searchArray;
    }

    //Get the total count that matches the filter object without pagination skipping / limiting
    const total = await ArticleModel.countDocuments(filterObject);

    //Get the paginated articles
    const articles = await ArticleModel.find(filterObject, { score: { $meta: "textScore" } })
      .select("-__v -body")
      .sort({ score: { $meta: "textScore" } })
      .sort({ datePosted: dateOrder })
      .skip(offset)
      .limit(limit)
      .collation({ locale: "en", strength: 2 });

    //Check for a featured article
    let featuredArticle = null;
    const featured = await FeaturedModel.findOne();
    let featuredArticleId = featured[`${typeName}Id`];
    if (featuredArticleId) featuredArticle = await ArticleModel.findOne({ _id: featured.articleId });

    const data = {
      offset: offset,
      limit: limit,
      dateOrder: dateOrder,
      total: total,
      search: search,
      items: articles,
      featured: featuredArticle,
    };
    res.send(data);
  });

  router.get("/:id", validateVariableId, async (req, res) => {
    let article;
    if (req.isIdSlug) article = await ArticleModel.findOne({ slug: req.params.id }).select("-__v");
    else article = await ArticleModel.findById(req.params.id).select("-__v");

    if (!article) return res.status(404).send("The article with the given ID or Slug was not found.");
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
      tags: req.body.tags.map((str) => str.trim()),
      contingency: req.body.contingency ? req.body.contingency : {},
    });

    article = await article.save();

    res.send(article);
  });

  router.put("/:id", [auth, admin, validateVariableId, validateBody(articleJoiSchema)], async (req, res) => {
    const articleCategory = await ArticleCategoryModel.findById(req.body.categoryId);
    if (!articleCategory) return res.status(400).send("Invalid article category.");

    let filter;
    if (req.isIdSlug) filter = { slug: req.params.id };
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
        tags: req.body.tags.map((str) => str.trim()),
        contingency: req.body.contingency,
      },
      {
        new: true,
      }
    );

    if (!updatedArticleModel) return res.status(404).send("The article with the given ID or Slug was not found.");

    res.send(updatedArticleModel);
  });

  router.delete("/:id", [auth, admin, validateVariableId], async (req, res) => {
    let filter;
    if (req.isIdSlug) filter = { slug: req.params.id };
    else filter = { _id: req.params.id };

    const article = await ArticleModel.findOneAndDelete(filter);
    if (!article) return res.status(404).send("The article with the given ID or Slug was not found.");

    res.send(article);
  });

  return router;
};
