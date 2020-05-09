const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/photo/getAllQuery");

const { Article: ArticleModel } = require("../models/article");
const { FeaturedModel, joiSchema: joiFeaturedModel } = require("../models/featured");
const ValidationUtilities = require("../util/validationUtilities");
const winston = require("winston");
const changeFeaturedArticleSchema = require("./schemas/body/featured/put/changeFeaturedArticle");

module.exports = function () {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const featured = await FeaturedModel.findOne();
    const article = await ArticleModel.findOne({ _id: featured.articleId });

    const data = {
      body: featured.body,
      article: article,
    };
    res.send(data);
  });

  router.get("/article", async (req, res) => {
    //The return -- null -- unless there's a featured article.
    let data = {
      article: null,
    };

    //Check existing featured article -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.articleId) {
      return res.send(data);
    }

    //If there's an existing featured article -- grab it.
    const matchingArticle = await ArticleModel.findOne({ _id: featured.articleId });
    if (!matchingArticle) {
      return res.send(data);
    }

    data.article = matchingArticle;

    //Return the newly featured article
    res.send(data);
  });

  router.put("/article", [auth, admin, validateBody(changeFeaturedArticleSchema)], async (req, res) => {
    //Make sure that article actually exists
    const matchingArticle = await ArticleModel.findOne({ _id: req.body.articleId }).select("-__v");
    if (!matchingArticle) return res.status(400).send("Invalid article id.");

    //Change the featured article id
    const featured = await FeaturedModel.findOne();
    featured.articleId = req.body.articleId;
    await featured.save();

    //The updated article
    const data = {
      article: matchingArticle,
    };

    //Return the newly featured article
    res.send(data);
  });

  router.delete("/article", [auth, admin], async (req, res) => {
    //The return -- null -- unless there's a featured article.
    let data = {
      article: null,
    };

    //Check existing featured article -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    featured.articleId = req.body.articleId;
    if (!featured.articleId) {
      return res.send(data);
    }

    //If there's an existing featured article -- grab it.
    const matchingArticle = await ArticleModel.findOne({ _id: req.body.articleId });
    if (!matchingArticle) {
      return res.send(data);
    }

    //Delete featured article
    featured.articleId = null;
    await featured.save();

    data.article = matchingArticle;

    //Return the newly featured article
    res.send(data);
  });

  return router;
};
