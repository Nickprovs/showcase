const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const { GeneralModel, joiSchema: joiGeneralSchema } = require("../models/general");

const winston = require("winston");

module.exports = function () {
  const router = express.Router();

  router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
    let general = await GeneralModel.findOne();
    res.send(general);
  });

  router.put("/", [auth, admin, validateBody(joiGeneralSchema)], async (req, res) => {
    let general = await GeneralModel.findOne();

    const updatedGeneral = await GeneralModel.findByIdAndUpdate(
      general._id,
      {
        title = req.body.title,
        footnote = req.body.footnote,
        socialLinks = req.body.socialLinks,
        dateLastModified = moment().toJSON()
      },
      { new: true }
    );

    if (!updatedGeneral) return res.status(404).send("General not found or could not be saved.");

    res.send(updatedGeneral);
  });

  return router;
};
