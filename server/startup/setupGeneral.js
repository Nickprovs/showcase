const { GeneralModel } = require("../models/general");
const moment = require("moment");

module.exports = async function () {
  let existingGeneral = await GeneralModel.findOne();

  if (!existingGeneral) {
    const general = new GeneralModel({
      title: "SHOWCASE",
      footnote: "© SOME BODY | BUILT BY SOME BODY | INSPIRED BY SOME BODY",
      portfolio: {
        title: "Software",
        show: true,
      },
      links: {
        linkedin: "https://www.linkedin.com/feed/",
        github: "https://github.com/",
        instagram: "https://www.instagram.com/",
        resume: "https://docs.google.com/document/d/1WR_axh5A9t1jwER_5mFCIcr5I1oNqm4cB1PHAQEEWqc"
      },
      dateLastModified: moment().toJSON(),
    });
    await general.save();
  }
};
