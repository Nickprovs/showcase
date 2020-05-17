const { GeneralModel } = require("../models/general");
const moment = require("moment");

module.exports = async function () {
  let existingGeneral = await GeneralModel.findOne();

  if (!existingGeneral) {
    const general = new GeneralModel({
      title: "SHOWCASE",
      footnote: "© NICHOLAS PROVOST | BUILT BY NICHOLAS PROVOST | INSPIRED BY @AJLKN",
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
