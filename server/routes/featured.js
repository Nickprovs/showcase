const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/photo/getAllQuery");

const { Article } = require("../models/article");
const { FeaturedModel, joiSchema: joiFeaturedModel } = require("../models/featured");
const ValidationUtilities = require("../util/validationUtilities");
const winston = require("winston");

module.exports = function () {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const featured = await FeaturedModel.findOne();
    const article = await Article.findOne({ _id: featured.articleId });

    const data = {
      article: article,
    };
    res.send(data);
  });

  return router;
};
