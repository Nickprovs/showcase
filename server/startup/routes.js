const auth = require("../routes/auth");
const me = require("../routes/me");
const articles = require("../routes/common/articles");
const media = require("../routes/common/media");
const categories = require("../routes/common/categories");

const { Article, joiSchema: joiArticleSchema } = require("../models/article");
const { Software, joiSchema: joiSoftwareSchema } = require("../models/software");
const { Photo, joiSchema: joiPhotoSchema } = require("../models/photo");
const { Video, joiSchema: joiVideoSchema } = require("../models/video");

const { ArticleCategory, joiSchema: joiArticleCategorySchema } = require("../models/articleCategory");
const { SoftwareCategory, joiSchema: joiSoftwareCategorySchema } = require("../models/softwareCategory");
const { PhotoCategory, joiSchema: joiPhotoCategorySchema } = require("../models/photoCategory");
const { VideoCategory, joiSchema: joiVideoCategorySchema } = require("../models/videoCategory");

module.exports = function(app) {
  app.use("/auth", auth);
  app.use("/me", me);

  app.use("/articles", articles(Article, joiArticleSchema, ArticleCategory));
  app.use("/articleCategories", categories(ArticleCategory, joiArticleCategorySchema));

  app.use("/software", articles(Software, joiSoftwareSchema, SoftwareCategory));
  app.use("/softwareCategories", categories(SoftwareCategory, joiSoftwareCategorySchema));

  app.use("/photos", media(Photo, joiPhotoSchema, PhotoCategory));
  app.use("/photoCategories", categories(PhotoCategory, joiPhotoCategorySchema));

  app.use("/videos", media(Video, joiVideoSchema, VideoCategory));
  app.use("/videoCategories", categories(VideoCategory, joiVideoCategorySchema));
};
