const auth = require("../routes/auth");
const me = require("../routes/me");
const categories = require("../routes/common/categories");
const articles = require("../routes/common/articles");
const photos = require("../routes/photo");
const videos = require("../routes/video");

const { Article, joiSchema: joiArticleSchema } = require("../models/article");
const { Software, joiSchema: joiSoftwareSchema } = require("../models/software");

const { ArticleCategory, joiSchema: joiArticleCategorySchema } = require("../models/articleCategory");
const { SoftwareCategory, joiSchema: joiSoftwareCategorySchema } = require("../models/softwareCategory");
const { PhotoCategoryModel, joiSchema: joiPhotoCategorySchema } = require("../models/photoCategory");
const { VideoCategoryModel, joiSchema: joiVideoCategorySchema } = require("../models/videoCategory");

module.exports = function (app) {
  app.use("/auth", auth);
  app.use("/me", me);

  app.use("/articles", articles(Article, joiArticleSchema, ArticleCategory));
  app.use("/articleCategories", categories(ArticleCategory, joiArticleCategorySchema));

  app.use("/software", articles(Software, joiSoftwareSchema, SoftwareCategory));
  app.use("/softwareCategories", categories(SoftwareCategory, joiSoftwareCategorySchema));

  app.use("/photos", photos());
  app.use("/photoCategories", categories(PhotoCategoryModel, joiPhotoCategorySchema));

  app.use("/videos", videos());
  app.use("/videoCategories", categories(VideoCategoryModel, joiVideoCategorySchema));
};
