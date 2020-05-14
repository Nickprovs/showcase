const { FeaturedModel } = require("../models/featured");
const moment = require("moment");

module.exports = async function () {
  let existingFeatured = await FeaturedModel.findOne();

  if (!existingFeatured) {
    const featured = new FeaturedModel({
      primary: {
        markup: "<h1>My Glorious Title</h1><br/><br/><p>My glorious paragraph</p>",
        dateLastModified: moment().toJSON(),
      },
      subsidiaries: {
        items: [],
        dateLastModified: moment().toJSON(),
      },
    });
    await featured.save();
  }
};
