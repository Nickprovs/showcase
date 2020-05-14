const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const { FeaturedModel, joiFeaturedSchema, joiPrimarySchema, joiSubsidiarySchema } = require("../models/featured");
const { Article: ArticleModel } = require("../models/article");
const { Software: SoftwareModel } = require("../models/software");
const { PhotoModel } = require("../models/photo");
const { VideoModel } = require("../models/video");
const getAllQuerySchema = require("./schemas/queries/featured/getAllQuery");
const getSubsidiariesQuerySchema = require("./schemas/queries/featured/getSubsidiariesQuery");
const patchSubsidiaryQuerySchema = require("./schemas/queries/featured/patchSubsidiaryQuery");

const winston = require("winston");

async function getContentByTypeAndId(type, id) {
  switch (type) {
    case "blog":
      return await ArticleModel.findOne({ _id: id });
    case "software":
      return await SoftwareModel.findOne({ _id: id });
    case "photo":
      return await PhotoModel.findOne({ _id: id });
    case "video":
      return await VideoModel.findOne({ _id: id });
    default:
      return null;
  }
}

module.exports = function () {
  const router = express.Router();

  router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
    const scope = req.query.scope ? req.query.scope : "detailed";
    let featured = await FeaturedModel.findOne();
    featured = featured.toObject();

    //Get detailed data for featured if scope is "detailed"
    switch (scope) {
      case "detailed":
        let detailedSubsidiaryItems = [];
        for (let item of featured.subsidiaries.items)
          detailedSubsidiaryItems.push({
            ...item,
            data: await getContentByTypeAndId(item.type, item.id),
          });
        featured.subsidiaries.items = detailedSubsidiaryItems;
        break;
      case "verbatim":
        break;
      default:
        break;
    }

    res.send({
      featured: featured,
      scope: scope,
    });
  });

  router.get("/primary", async (req, res) => {
    let featured = await FeaturedModel.findOne();
    res.send({
      primary: featured.primary,
    });
  });

  router.get("/subsidiaries", validateQuery(getSubsidiariesQuerySchema), async (req, res) => {
    const scope = req.query.scope ? req.query.scope : "detailed";
    let featured = await FeaturedModel.findOne();
    featured = featured.toObject();

    switch (scope) {
      case "detailed":
        let detailedSubsidiaryItems = [];
        for (let item of featured.subsidiaries.items)
          detailedSubsidiaryItems.push({
            ...item,
            data: await getContentByTypeAndId(item.type, item.id),
          });
        featured.subsidiaries.items = detailedSubsidiaryItems;
        break;
      case "verbatim":
        break;
      default:
        break;
    }

    res.send({
      subsidiaries: featured.subsidiaries,
      scope: scope,
    });
  });

  router.put("/primary", [auth, admin, validateBody(joiPrimarySchema)], async (req, res) => {
    let featured = await FeaturedModel.findOne();
    featured.primary.markup = req.body.markup;
    featured.primary.dateLastModified = moment().toJSON();

    await featured.save();
    res.send({ primary: featured.primary });
  });

  router.post("/subsidiaries", [auth, admin, validateBody(joiSubsidiarySchema)], async (req, res) => {
    let featured = await FeaturedModel.findOne();
    const contentToSave = await getContentByTypeAndId(req.body.type, req.body.id);
    if (!contentToSave) return res.status(400).send("The specified content was not found. Cannot save in featured.");

    if (featured.subsidiaries.items.some((item) => item.id.toString() === req.body.id))
      return res.status(400).send("Cannot feature the same content twice.");

    let newFeaturedSubsidiary = {
      id: req.body.id,
      type: req.body.type,
    };
    featured.subsidiaries.items.push(newFeaturedSubsidiary);
    featured.subsidiaries.dateLastModified = moment().toJSON();

    await featured.save();
    res.send({ subsidiary: newFeaturedSubsidiary });
  });

  router.patch("/subsidiaries/:id", [auth, admin], validateQuery(patchSubsidiaryQuerySchema), async (req, res) => {
    let featured = await FeaturedModel.findOne();

    let itemToUpdate = featured.subsidiaries.items.find((item) => item.id.toString() === req.params.id);
    if (!itemToUpdate) return res.status(400).send("An item with the specified id doesn't exist in featured subsidiaries.");

    switch (req.query.operation) {
      case "bump":
        featured.subsidiaries.items.splice(featured.subsidiaries.items.indexOf(itemToUpdate), 1);
        featured.subsidiaries.items.unshift(itemToUpdate);
        featured.subsidiaries.dateLastModified = moment().toJSON();

        await featured.save();
        res.send({ subsidiaries: featured.subsidiaries });
        break;
      default:
        return res.status(400).send("Invalid patch operation specified. Add operation to query.");
    }
  });

  router.delete("/subsidiaries/:id", [auth, admin], async (req, res) => {
    let featured = await FeaturedModel.findOne();

    let itemToDelete = featured.subsidiaries.items.find((item) => item.id.toString() === req.params.id);
    if (!itemToDelete) return res.status(400).send("An item with the specified id doesn't exist in featured subsidiaries.");

    featured.subsidiaries.items.splice(featured.subsidiaries.items.indexOf(itemToDelete), 1);
    featured.subsidiaries.dateLastModified = moment().toJSON();

    await featured.save();
    res.send({ subsidiary: itemToDelete });
  });

  router.delete("/subsidiaries", [auth, admin], async (req, res) => {
    let featured = await FeaturedModel.findOne();
    featured.subsidiaries.items = [];
    featured.subsidiaries.dateLastModified = moment().toJSON();

    await featured.save();
    res.send({ subsidiaries: featured.subsidiaries.items });
  });

  return router;
};
