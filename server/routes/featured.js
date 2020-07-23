const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const { FeaturedModel, joiFeaturedSchema, joiPrimarySchema, joiSubsidiarySchema } = require("../models/featured");
const { Blog: BlogModel } = require("../models/blog");
const { Portfolio: PortfolioModel } = require("../models/portfolio");
const { PhotoModel } = require("../models/photo");
const { MediaModel } = require("../models/media");
const getAllQuerySchema = require("./schemas/queries/featured/getAllQuery");
const getSubsidiariesQuerySchema = require("./schemas/queries/featured/getSubsidiariesQuery");
const patchSubsidiaryQuerySchema = require("./schemas/queries/featured/patchSubsidiaryQuery");
const { sanitize } = require("isomorphic-dompurify");
const winston = require("winston");

async function getContentByTypeAndId(type, id) {
  switch (type) {
    case "blog":
      return await BlogModel.findOne({ _id: id });
    case "portfolio":
      return await PortfolioModel.findOne({ _id: id });
    case "photo":
      return await PhotoModel.findOne({ _id: id });
    case "media":
      return await MediaModel.findOne({ _id: id });
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
        for (let item of featured.subsidiaries.items) {
          let data = await getContentByTypeAndId(item.type, item.id);
          if (data) {
            detailedSubsidiaryItems.push({
              ...item,
              data: data,
            });
          }
        }
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

  router.put("/primary", [auth(), admin, validateBody(joiPrimarySchema)], async (req, res) => {
    let featured = await FeaturedModel.findOne();
    featured.primary.markup = sanitize(req.body.markup);
    featured.primary.dateLastModified = moment().toJSON();

    await featured.save();
    res.send(featured.primary);
  });

  router.post("/subsidiaries", [auth(), admin, validateBody(joiSubsidiarySchema)], async (req, res) => {
    let featured = await FeaturedModel.findOne();
    const contentToSave = await getContentByTypeAndId(req.body.type, req.body.id);
    if (!contentToSave) return res.status(400).send("The specified content was not found. Cannot save in featured.");

    if (featured.subsidiaries.items.some((item) => item.id.toString() === req.body.id)) return res.status(400).send("Cannot feature the same content twice.");

    let newFeaturedSubsidiary = {
      id: req.body.id,
      type: req.body.type,
    };
    featured.subsidiaries.items.push(newFeaturedSubsidiary);
    featured.subsidiaries.dateLastModified = moment().toJSON();

    await featured.save();
    res.send(newFeaturedSubsidiary);
  });

  router.patch("/subsidiaries/:id", [auth(), admin], validateQuery(patchSubsidiaryQuerySchema), async (req, res) => {
    let featured = await FeaturedModel.findOne();

    let itemToUpdate = featured.subsidiaries.items.find((item) => item.id.toString() === req.params.id);
    if (!itemToUpdate) return res.status(400).send("An item with the specified id doesn't exist in featured subsidiaries.");

    let oldIndex = 0;
    let newIndex = 0;
    let newIndexExists = false;

    switch (req.query.operation) {
      case "raise":
        //Get the old index and calculate the new index
        oldIndex = featured.subsidiaries.items.indexOf(itemToUpdate);
        featured.subsidiaries.items.splice(oldIndex, 1);
        newIndex = oldIndex - 1;
        newIndexExists = featured.subsidiaries.items[newIndex] !== undefined;
        if (!newIndexExists) return res.status(400).send("Cannot raise this item anymore. It's already at the top.");
        featured.subsidiaries.items.splice(newIndex, 0, itemToUpdate);
        featured.subsidiaries.dateLastModified = moment().toJSON();
        break;
      case "lower":
        //Get the old index and calculate the new index
        oldIndex = featured.subsidiaries.items.indexOf(itemToUpdate);
        newIndex = oldIndex + 1;
        newIndexExists = featured.subsidiaries.items[newIndex] !== undefined;
        if (!newIndexExists) return res.status(400).send("Cannot lower this item anymore. It's already at the bottom.");
        featured.subsidiaries.items.splice(oldIndex, 1);
        featured.subsidiaries.items.splice(newIndex, 0, itemToUpdate);
        featured.subsidiaries.dateLastModified = moment().toJSON();
        break;
      default:
        return res.status(400).send("Invalid patch operation specified. Add operation to query.");
    }

    await featured.save();

    //Returned the detailed subsidiaries so that the client doesn't need to re-order
    featured = featured.toObject();
    let detailedSubsidiaryItems = [];
    for (let item of featured.subsidiaries.items) {
      let data = await getContentByTypeAndId(item.type, item.id);
      if (data) {
        detailedSubsidiaryItems.push({
          ...item,
          data: data,
        });
      }
    }
    featured.subsidiaries.items = detailedSubsidiaryItems;
    res.send(featured.subsidiaries);
  });

  router.delete("/subsidiaries/:id", [auth(), admin], async (req, res) => {
    let featured = await FeaturedModel.findOne();

    let itemToDelete = featured.subsidiaries.items.find((item) => item.id.toString() === req.params.id);
    if (!itemToDelete) return res.status(400).send("An item with the specified id doesn't exist in featured subsidiaries.");

    featured.subsidiaries.items.splice(featured.subsidiaries.items.indexOf(itemToDelete), 1);
    featured.subsidiaries.dateLastModified = moment().toJSON();

    await featured.save();
    res.send({ subsidiary: itemToDelete });
  });

  router.delete("/subsidiaries", [auth(), admin], async (req, res) => {
    let featured = await FeaturedModel.findOne();
    featured.subsidiaries.items = [];
    featured.subsidiaries.dateLastModified = moment().toJSON();

    await featured.save();
    res.send({ subsidiaries: featured.subsidiaries.items });
  });

  return router;
};
