const auth = require("../routes/auth");
const me = require("../routes/me");
const articles = require("../routes/common/articles");
const categories = require("../routes/common/categories");
const photos = require("../routes/photo");

const { Article, joiSchema: joiArticleSchema } = require("../models/article");
const { Software, joiSchema: joiSoftwareSchema } = require("../models/software");
// const { Video, joiSchema: joiVideoSchema } = require("../models/video");

const { ArticleCategory, joiSchema: joiArticleCategorySchema } = require("../models/articleCategory");
const { SoftwareCategory, joiSchema: joiSoftwareCategorySchema } = require("../models/softwareCategory");
const { PhotoCategoryModel, joiSchema: joiPhotoCategorySchema } = require("../models/photoCategory");
// const { VideoCategory, joiSchema: joiVideoCategorySchema } = require("../models/videoCategory");

module.exports = function (app) {
  app.use("/auth", auth);
  app.use("/me", me);

  app.use("/articles", articles(Article, joiArticleSchema, ArticleCategory));
  app.use("/articleCategories", categories(ArticleCategory, joiArticleCategorySchema));

  app.use("/software", articles(Software, joiSoftwareSchema, SoftwareCategory));
  app.use("/softwareCategories", categories(SoftwareCategory, joiSoftwareCategorySchema));

  app.use("/photos", photos());
  app.use("/photoCategories", categories(PhotoCategoryModel, joiPhotoCategorySchema));

  // app.use("/photos", (req, res) => {
  //   res.send("hello");
  // });

  // app.use("/videos", media(Video, joiVideoSchema, VideoCategory));
  // app.use("/videoCategories", categories(VideoCategory, joiVideoCategorySchema));
};
