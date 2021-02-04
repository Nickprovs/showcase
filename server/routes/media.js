const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/media/getAllQuery");
const { MediaModel, joiSchema: joiMediaSchema } = require("../models/media");
const { MediaCategoryModel } = require("../models/mediaCategory");
const { FeaturedModel } = require("../models/featured");
const ValidationUtilities = require("../util/validationUtilities");
const { sanitize } = require("isomorphic-dompurify");
const winston = require("winston");

module.exports = function () {
  const router = express.Router();

  router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
    const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const categoryId = req.query.category ? req.query.category : "";
    const search = req.query.search ? req.query.search : "";

    //Build filter object if filterable query data was passed
    const filterObject = {};

    if (categoryId) {
      let mediaCategory;
      const { isIdSlug } = ValidationUtilities.isVariableId(categoryId);

      if (isIdSlug) mediaCategory = await MediaCategoryModel.findOne({ slug: categoryId }).select("-__v");
      else mediaCategory = await MediaCategoryModel.findById(categoryId);

      if (!mediaCategory) return res.status(400).send("Invalid media category in query.");
      filterObject["category._id"] = mediaCategory._id;
    }

    let total = 0;
    let medias = null;

    if (search) {
      const searchArray = [];
      searchArray.push({ $text: { $search: search } });
      filterObject["$or"] = searchArray;

      //Get the total count that matches the filter object without pagination skipping / limiting
      total = await MediaModel.countDocuments(filterObject);

      //Get the paginated medias
      medias = await MediaModel.find(filterObject, { score: { $meta: "textScore" } })
        .select("-__v -body")
        .sort({ score: { $meta: "textScore" } })
        .sort({ datePosted: dateOrder })
        .skip(offset)
        .limit(limit)
        .collation({ locale: "en", strength: 2 });
    } else {
      //Get the total count that matches the filter object without pagination skipping / limiting
      total = await MediaModel.countDocuments(filterObject);

      //Get the paginated medias
      medias = await MediaModel.find(filterObject)
        .select("-__v -body")
        .sort({ datePosted: dateOrder })
        .skip(offset)
        .limit(limit)
        .collation({ locale: "en", strength: 2 });
    }

    const data = {
      offset: offset,
      limit: limit,
      dateOrder: dateOrder,
      total: total,
      search: search,
      items: medias,
    };

    res.send(data);
  });

  router.get("/:id", validateObjectId, async (req, res) => {
    const media = await MediaModel.findById(req.params.id).select("-__v");
    if (!media) return res.status(404).send("The media with the given ID was not found.");

    res.send(media);
  });

  router.post("/", [auth(), admin, validateBody(joiMediaSchema)], async (req, res) => {
    const mediaCategory = await MediaCategoryModel.findById(req.body.categoryId);
    if (!mediaCategory) return res.status(400).send("Invalid media category.");

    const existingMedia = await MediaModel.findOne({ title: req.body.title });
    if (existingMedia) return res.status(400).send("Media with same title already exists.");

    let now = moment().toJSON();
    let media = new MediaModel({
      title: req.body.title,
      category: mediaCategory,
      datePosted: now,
      dateLastModified: now,
      description: req.body.description,
      markup: sanitize(req.body.markup),
      addressableHighlights: req.body.addressableHighlights,
      tags: req.body.tags,
    });

    media = await media.save();

    res.send(media);
  });

  router.put("/:id", [auth(), admin, validateObjectId, validateBody(joiMediaSchema)], async (req, res) => {
    const mediaCategory = await MediaCategoryModel.findById(req.body.categoryId);
    if (!mediaCategory) return res.status(400).send("Invalid media category.");

    //Get the media to update
    let media = await MediaModel.findById(req.params.id).select("-__v");
    if (!media) return res.status(404).send("The media with the given ID not found.");

    //Check for medias that would result in a conflict
    let mediasThatWouldCauseConflict = await MediaModel.find({
      $and: [{ $or: [{ title: { $regex: new RegExp(req.body.title, "i") } }] }, { _id: { $ne: req.params.id } }],
    });
    if (mediasThatWouldCauseConflict.length > 0) return res.status(400).send("A media with a matching title or slug already exists");

    media.title = req.body.title;
    media.category = mediaCategory;
    media.dateLastModified = moment().toJSON();
    media.description = req.body.description;
    media.markup = sanitize(req.body.markup);
    media.addressableHighlights = req.body.addressableHighlights;
    media.tags = req.body.tags;
    await media.save();

    res.send(media);
  });

  router.delete("/:id", [auth(), admin, validateObjectId], async (req, res) => {
    const media = await MediaModel.findByIdAndRemove(req.params.id);
    if (!media) return res.status(404).send("The media with the given ID was not found.");

    //Remove from featured if present
    let featured = await FeaturedModel.findOne();
    featured.subsidiaries.items = featured.subsidiaries.items.filter((s) => s.id.toString() !== media._id.toString());
    await featured.save();

    res.send(media);
  });

  return router;
};
