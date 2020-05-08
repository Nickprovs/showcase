const { FeaturedModel } = require("../models/featured");

module.exports = async function () {
  let existingFeatured = await FeaturedModel.findOne();

  if (!existingFeatured) {
    const featured = new FeaturedModel({
      body: "<h1>My Glorious Title</h1><br/><br/><p>My glorious paragraph</p>",
      articleId: null,
      softwareId: null,
      photoId: null,
      videoId: null,
    });
    await featured.save();
  }
};
