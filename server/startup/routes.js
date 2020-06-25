const express = require("express");
const config = require("config");
const auth = require("../routes/auth");
const me = require("../routes/me");
const contact = require("../routes/contact");
const general = require("../routes/general");
const featured = require("../routes/featured");
const categories = require("../routes/common/categories");
const articles = require("../routes/common/articles");
const photos = require("../routes/photo");
const medias = require("../routes/media");

const { Blog, joiSchema: joiBlogSchema } = require("../models/blog");
const { Software, joiSchema: joiSoftwareSchema } = require("../models/software");

const { BlogCategory, joiSchema: joiBlogCategorySchema } = require("../models/blogCategory");
const { SoftwareCategory, joiSchema: joiSoftwareCategorySchema } = require("../models/softwareCategory");
const { PhotoCategoryModel, joiSchema: joiPhotoCategorySchema } = require("../models/photoCategory");
const { MediaCategoryModel, joiSchema: joiMediaCategorySchema } = require("../models/mediaCategory");

module.exports = function (app) {
  const router = express.Router();

  router.use("/general", general());
  router.use("/featured", featured());
  router.use("/contact", contact);
  router.use("/auth", auth);
  router.use("/me", me);
  router.use("/blogs", articles(Blog, joiBlogSchema, BlogCategory, "blog"));
  router.use("/blogCategories", categories(BlogCategory, joiBlogCategorySchema));
  router.use("/software", articles(Software, joiSoftwareSchema, SoftwareCategory, "software"));
  router.use("/softwareCategories", categories(SoftwareCategory, joiSoftwareCategorySchema));
  router.use("/photos", photos());
  router.use("/photoCategories", categories(PhotoCategoryModel, joiPhotoCategorySchema));
  router.use("/medias", medias());
  router.use("/mediaCategories", categories(MediaCategoryModel, joiMediaCategorySchema));

  const servedAtPath = config.has("servedAtPath") ? config.get("servedAtPath") : "/api";
  app.use(servedAtPath, router);
};
