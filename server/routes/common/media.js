const express = require("express");
const moment = require("moment");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validateBody = require("../../middleware/validateBody");
const validateQuery = require("../../middleware/validateQuery");
const validateObjectId = require("../../middleware/validateObjectId");
const getAllQuerySchema = require("../schemas/queries/media/getAllQuery");
const winston = require("winston");

module.exports = function(MediaModel, mediaJoiSchema, MediaCategoryModel) {
  const router = express.Router();

  router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
    const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const categoryId = req.query.categoryId ? req.query.categoryId : "";
    const search = req.query.search ? req.query.search : "";

    const filterObject = {};

    //Build filter object if filterable query data was passed
    if (categoryId) {
      const mediaCategory = await MediaCategoryModel.findById(categoryId);
      if (!mediaCategory) return res.status(400).send("Invalid media category in query.");

      filterObject["category"] = mediaCategory;
    }

    if (search) {
      //Filters on all collection properties that have a text index
      //The double quotes aided by our escape character set...
      //...the predicate to have all words in the search (whitespace delimmited).
      const fuzzySearch = `\"${search}\"`;
      filterObject["$text"] = { $search: fuzzySearch };
    }

    //Get the total count that matches the filter object without pagination skipping / limiting
    const total = await MediaModel.countDocuments(filterObject);

    //Get the paginated medias
    const medias = await MediaModel.find(filterObject)
      .select("-__v -body")
      .sort({ datePosted: dateOrder })
      .skip(offset)
      .limit(limit);

    const data = {
      offset: offset,
      limit: limit,
      dateOrder: dateOrder,
      total: total,
      search: search,
      items: medias
    };

    res.send(data);
  });

  router.get("/:id", validateObjectId, async (req, res) => {
    const media = await MediaModel.findById(req.params.id).select("-__v");
    if (!media) return res.status(404).send("The media with the given ID was not found.");

    res.send(media);
  });

  router.post("/", [auth, admin, validateBody(mediaJoiSchema)], async (req, res) => {
    const mediaCategory = await MediaCategoryModel.findById(req.body.categoryId);
    if (!mediaCategory) return res.status(400).send("Invalid media category.");

    let media = new MediaModel({
      title: req.body.title,
      category: mediaCategory,
      datePosted: moment().toJSON(),
      dateLastModified: moment().toJSON(),
      description: req.body.description,
      orientation: req.body.orientation,
      displaySize: req.body.displaySize,
      source: req.body.source,
      tags: req.body.tags
    });

    media = await media.save();

    res.send(media);
  });

  router.put("/:id", [auth, admin, validateObjectId, validateBody(mediaJoiSchema)], async (req, res) => {
    const mediaCategory = await MediaCategoryModel.findById(req.body.categoryId);
    if (!mediaCategory) return res.status(400).send("Invalid media category.");

    const updatedPhoto = await MediaModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        category: mediaCategory,
        dateLastModified: moment().toJSON(),
        description: req.body.description,
        orientation: req.body.orientation,
        displaySize: req.body.displaySize,
        source: req.body.source,
        tags: req.body.tags
      },
      { new: true }
    );

    if (!updatedPhoto) return res.status(404).send("Photo not found.");

    res.send(updatedPhoto);
  });

  router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const media = await MediaModel.findByIdAndRemove(req.params.id);
    if (!media) return res.status(404).send("The media with the given ID was not found.");

    res.send(media);
  });

  return router;
};
