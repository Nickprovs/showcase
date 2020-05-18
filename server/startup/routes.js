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
const { VideoCategoryModel, joiSchema: joiVideoCategorySchema } = require("../models/mediaCategory");

module.exports = function (app) {
  app.use("/general", general());
  app.use("/featured", featured());
  app.use("/contact", contact);
  app.use("/auth", auth);
  app.use("/me", me);

  app.use("/blogs", articles(Blog, joiBlogSchema, BlogCategory, "blog"));
  app.use("/blogCategories", categories(BlogCategory, joiBlogCategorySchema));

  app.use("/software", articles(Software, joiSoftwareSchema, SoftwareCategory, "software"));
  app.use("/softwareCategories", categories(SoftwareCategory, joiSoftwareCategorySchema));

  app.use("/photos", photos());
  app.use("/photoCategories", categories(PhotoCategoryModel, joiPhotoCategorySchema));

  app.use("/medias", medias());
  app.use("/mediaCategories", categories(VideoCategoryModel, joiVideoCategorySchema));
};
