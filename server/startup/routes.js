const auth = require("../routes/auth");
const photos = require("../routes/photos");
const videos = require("../routes/videos");
const articles = require("../routes/common/articles");
const categories = require("../routes/common/categories");

const { Article, joiSchema: joiArticleSchema } = require("../models/article");
const { Software, joiSchema: joiSoftwareSchema } = require("../models/software");

const { ArticleCategory, joiSchema: joiArticleCategorySchema } = require("../models/articleCategory");
const { SoftwareCategory, joiSchema: joiSoftwareCategorySchema } = require("../models/softwareCategory");
const { PhotoCategory, joiSchema: joiPhotoCategorySchema } = require("../models/photoCategory");
const { VideoCategory, joiSchema: joiVideoCategorySchema } = require("../models/videoCategory");

module.exports = function(app) {
  app.use("/auth", auth);

  app.use("/articles", articles(Article, joiArticleSchema, ArticleCategory));
  app.use("/articleCategories", categories(ArticleCategory, joiArticleCategorySchema));

  app.use("/software", articles(Software, joiSoftwareSchema, SoftwareCategory));
  app.use("/softwareCategories", categories(SoftwareCategory, joiSoftwareCategorySchema));

  app.use("/photos", photos);
  app.use("/photoCategories", categories(PhotoCategory, joiPhotoCategorySchema));

  app.use("/videos", videos);
  app.use("/videoCategories", categories(VideoCategory, joiVideoCategorySchema));
};
