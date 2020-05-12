const { FeaturedModel } = require("../models/featured");
const moment = require("moment");

module.exports = async function () {
  let existingFeatured = await FeaturedModel.findOne();

  if (!existingFeatured) {
    const featured = new FeaturedModel({
      primary: {
        markup: "<h1>My Glorious Title</h1><br/><br/><p>My glorious paragraph</p>",
        dateLastModified: moment.json(),
      },
      sub1: {
        id: null,
        type: null,
        dateLastModified: null,
      },
      sub2: {
        id: null,
        type: null,
        dateLastModified: null,
      },
    });
    await featured.save();
  }
};
