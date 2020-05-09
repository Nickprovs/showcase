const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/video/getAllQuery");
const { VideoModel, joiSchema: joiVideoSchema } = require("../models/video");
const { VideoCategoryModel } = require("../models/videoCategory");
const { FeaturedModel } = require("../models/featured");
const ValidationUtilities = require("../util/validationUtilities");

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
      let videoCategory;
      const { isIdSlug } = ValidationUtilities.isVariableId(categoryId);

      if (isIdSlug) videoCategory = await VideoCategoryModel.findOne({ slug: categoryId }).select("-__v");
      else videoCategory = await VideoCategoryModel.findById(categoryId);

      if (!videoCategory) return res.status(400).send("Invalid video category in query.");
      filterObject["category._id"] = videoCategory._id;
    }

    if (search) {
      const searchArray = [];
      searchArray.push({ $text: { $search: search } });
      filterObject["$or"] = searchArray;
    }

    //Get the total count that matches the filter object without pagination skipping / limiting
    const total = await VideoModel.countDocuments(filterObject);

    //Get the paginated videos
    const videos = await VideoModel.find(filterObject, { score: { $meta: "textScore" } })
      .select("-__v -body")
      .sort({ score: { $meta: "textScore" } })
      .sort({ datePosted: dateOrder })
      .skip(offset)
      .limit(limit)
      .collation({ locale: "en", strength: 2 });

    //Check for a featured video
    let featuredVideo = null;
    const featured = await FeaturedModel.findOne();
    if (featured.videoId) featuredVideo = await VideoModel.findOne({ _id: featured.videoId });

    const data = {
      offset: offset,
      limit: limit,
      dateOrder: dateOrder,
      total: total,
      search: search,
      items: videos,
      featured: featuredVideo,
    };

    res.send(data);
  });

  router.get("/:id", validateObjectId, async (req, res) => {
    const video = await VideoModel.findById(req.params.id).select("-__v");
    if (!video) return res.status(404).send("The video with the given ID was not found.");

    res.send(video);
  });

  router.post("/", [auth, admin, validateBody(joiVideoSchema)], async (req, res) => {
    const videoCategory = await VideoCategoryModel.findById(req.body.categoryId);
    if (!videoCategory) return res.status(400).send("Invalid video category.");

    let video = new VideoModel({
      title: req.body.title,
      category: videoCategory,
      datePosted: moment().toJSON(),
      dateLastModified: moment().toJSON(),
      description: req.body.description,
      markup: req.body.markup,
      tags: req.body.tags,
    });

    video = await video.save();

    res.send(video);
  });

  router.put("/:id", [auth, admin, validateObjectId, validateBody(joiVideoSchema)], async (req, res) => {
    const videoCategory = await VideoCategoryModel.findById(req.body.categoryId);
    if (!videoCategory) return res.status(400).send("Invalid video category.");

    const updatedVideo = await VideoModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        category: videoCategory,
        dateLastModified: moment().toJSON(),
        description: req.body.description,
        markup: req.body.markup,
        tags: req.body.tags,
      },
      { new: true }
    );

    if (!updatedVideo) return res.status(404).send("Video not found.");

    res.send(updatedVideo);
  });

  router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const video = await VideoModel.findByIdAndRemove(req.params.id);
    if (!video) return res.status(404).send("The video with the given ID was not found.");

    res.send(video);
  });

  return router;
};
