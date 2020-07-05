const { GeneralModel } = require("../models/general");
const moment = require("moment");

module.exports = async function () {
  let existingGeneral = await GeneralModel.findOne();

  if (!existingGeneral) {
    const general = new GeneralModel({
      title: "SHOWCASE",
      footnote: "© SOME BODY | BUILT BY SOME BODY | INSPIRED BY SOME BODY",
      profession: {
        title: "Software",
        show: true,
      },
      socialLinks: {
        linkedin: "https://www.linkedin.com/feed/",
        github: "https://github.com/",
        instagram: "https://www.instagram.com/",
      },
      dateLastModified: moment().toJSON(),
    });
    await general.save();
  }
};
