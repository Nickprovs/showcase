const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/photo/getAllQuery");
const { PhotoModel, joiSchema: joiPhotoSchema } = require("../models/photo");
const { PhotoCategoryModel } = require("../models/photoCategory");
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
      let photoCategory;
      const { isIdSlug } = ValidationUtilities.isVariableId(categoryId);

      if (isIdSlug) photoCategory = await PhotoCategoryModel.findOne({ slug: categoryId }).select("-__v");
      else photoCategory = await PhotoCategoryModel.findById(categoryId);

      if (!photoCategory) return res.status(400).send("Invalid photo category in query.");
      filterObject["category._id"] = photoCategory._id;
    }

    if (search) {
      const searchArray = [];
      searchArray.push({ $text: { $search: search } });
      filterObject["$or"] = searchArray;
    }

    //Get the total count that matches the filter object without pagination skipping / limiting
    const total = await PhotoModel.countDocuments(filterObject);

    //Get the paginated photos
    const photos = await PhotoModel.find(filterObject, { score: { $meta: "textScore" } })
      .select("-__v -body")
      .sort({ score: { $meta: "textScore" } })
      .sort({ datePosted: dateOrder })
      .skip(offset)
      .limit(limit)
      .collation({ locale: "en", strength: 2 });

    const data = {
      offset: offset,
      limit: limit,
      dateOrder: dateOrder,
      total: total,
      search: search,
      items: photos,
    };

    res.send(data);
  });

  router.get("/:id", validateObjectId, async (req, res) => {
    const photo = await PhotoModel.findById(req.params.id).select("-__v");
    if (!photo) return res.status(404).send("The photo with the given ID was not found.");

    res.send(photo);
  });

  router.post("/", [auth(), admin, validateBody(joiPhotoSchema)], async (req, res) => {
    const photoCategory = await PhotoCategoryModel.findById(req.body.categoryId);
    if (!photoCategory) return res.status(400).send("Invalid photo category.");

    const existingPhoto = await PhotoModel.findOne({ title: req.body.title });
    if (existingPhoto) return res.status(400).send("Photo with same title already exists.");

    let now = moment().toJSON();
    let photo = new PhotoModel({
      title: req.body.title,
      category: photoCategory,
      datePosted: now,
      dateLastModified: now,
      description: req.body.description,
      orientation: req.body.orientation,
      displaySize: req.body.displaySize,
      source: req.body.source,
      tags: req.body.tags,
    });

    photo = await photo.save();

    res.send(photo);
  });

  router.put("/:id", [auth(), admin, validateObjectId, validateBody(joiPhotoSchema)], async (req, res) => {
    const photoCategory = await PhotoCategoryModel.findById(req.body.categoryId);
    if (!photoCategory) return res.status(400).send("Invalid photo category.");

    const updatedPhoto = await PhotoModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        category: photoCategory,
        dateLastModified: moment().toJSON(),
        description: req.body.description,
        orientation: req.body.orientation,
        displaySize: req.body.displaySize,
        source: req.body.source,
        tags: req.body.tags,
      },
      { new: true }
    );

    if (!updatedPhoto) return res.status(404).send("Photo not found.");

    res.send(updatedPhoto);
  });

  router.delete("/:id", [auth(), admin, validateObjectId], async (req, res) => {
    const photo = await PhotoModel.findByIdAndRemove(req.params.id);
    if (!photo) return res.status(404).send("The photo with the given ID was not found.");

    res.send(photo);
  });

  return router;
};
