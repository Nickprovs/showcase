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
  app.use("/api/general", general());
  app.use("/api/featured", featured());
  app.use("/api/contact", contact);
  app.use("/api/auth", auth);
  app.use("/api/me", me);

  app.use("/api/blogs", articles(Blog, joiBlogSchema, BlogCategory, "blog"));
  app.use("/api/blogCategories", categories(BlogCategory, joiBlogCategorySchema));

  app.use("/api/software", articles(Software, joiSoftwareSchema, SoftwareCategory, "software"));
  app.use("/api/softwareCategories", categories(SoftwareCategory, joiSoftwareCategorySchema));

  app.use("/api/photos", photos());
  app.use("/api/photoCategories", categories(PhotoCategoryModel, joiPhotoCategorySchema));

  app.use("/api/medias", medias());
  app.use("/api/mediaCategories", categories(MediaCategoryModel, joiMediaCategorySchema));
};
