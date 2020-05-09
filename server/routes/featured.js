const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/photo/getAllQuery");

const { Article: ArticleModel } = require("../models/article");
const { Software: SoftwareModel } = require("../models/software");
const { FeaturedModel, joiSchema: joiFeaturedModel } = require("../models/featured");
const ValidationUtilities = require("../util/validationUtilities");
const winston = require("winston");
const changeFeaturedArticleSchema = require("./schemas/body/featured/put/changeFeaturedArticle");
const changeFeaturedSoftwareSchema = require("./schemas/body/featured/put/changeFeaturedSoftware");

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
    if (!featured.articleId) return res.send(data);

    //If there's an existing featured article -- grab it.
    const matchingArticle = await ArticleModel.findOne({ _id: featured.articleId });
    if (!matchingArticle) return res.send(data);

    //Return the newly featured article
    data.article = matchingArticle;
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

    //Return updated article
    const data = {
      article: matchingArticle,
    };
    res.send(data);
  });

  router.delete("/article", [auth, admin], async (req, res) => {
    //The return will be the featured article if it exists.
    let data = {
      article: null,
    };

    //Check existing featured article -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.articleId) return res.send(data);
    const matchingArticle = await ArticleModel.findOne({ _id: featured.articleId });

    //Deletion
    featured.articleId = null;
    await featured.save();

    //Return what was deleted
    data.article = matchingArticle;
    res.send(data);
  });

  router.get("/software", async (req, res) => {
    //The return -- null -- unless there's a featured software.
    let data = {
      software: null,
    };

    //Check existing featured software -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.softwareId) return res.send(data);

    //If there's an existing featured software -- grab it.
    const matchingSoftware = await SoftwareModel.findOne({ _id: featured.softwareId });
    if (!matchingSoftware) return res.send(data);

    //Return the newly featured software
    data.software = matchingSoftware;
    res.send(data);
  });

  router.put("/software", [auth, admin, validateBody(changeFeaturedSoftwareSchema)], async (req, res) => {
    //Make sure that software actually exists
    const matchingSoftware = await SoftwareModel.findOne({ _id: req.body.softwareId }).select("-__v");
    if (!matchingSoftware) return res.status(400).send("Invalid software id.");

    //Change the featured software id
    const featured = await FeaturedModel.findOne();
    featured.softwareId = req.body.softwareId;
    await featured.save();

    //Return updated software
    const data = {
      software: matchingSoftware,
    };
    res.send(data);
  });

  router.delete("/software", [auth, admin], async (req, res) => {
    //The return will be the featured software if it exists.
    let data = {
      software: null,
    };

    //Check existing featured software -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.softwareId) return res.send(data);
    const matchingSoftware = await SoftwareModel.findOne({ _id: featured.softwareId });

    //Deletion
    featured.softwareId = null;
    await featured.save();

    //Return what was deleted
    data.software = matchingSoftware;
    res.send(data);
  });

  return router;
};
