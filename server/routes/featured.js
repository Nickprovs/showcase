const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/photo/getAllQuery");
const { FeaturedModel, joiSchema: joiFeaturedModel } = require("../models/featured");
const ValidationUtilities = require("../util/validationUtilities");
const winston = require("winston");

module.exports = function () {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const featured = await FeaturedModel.findOne();
    res.send(featured);
  });

  router.put("/video", auth, admin, async (req, res) => {
    //TODO: Validate query (should have videoId in body)
    //TODO: Check if item exists in native table
    //

    const featured = await FeaturedModel.findOne();
    featured.videoId = req.body.videoId;
    res.send(featured);
  });

  return router;
};

//   router.post("/", [auth, admin, validateBody(joiPhotoSchema)], async (req, res) => {
//     const photoCategory = await PhotoCategoryModel.findById(req.body.categoryId);
//     if (!photoCategory) return res.status(400).send("Invalid photo category.");

//     let photo = new PhotoModel({
//       title: req.body.title,
//       category: photoCategory,
//       datePosted: moment().toJSON(),
//       dateLastModified: moment().toJSON(),
//       description: req.body.description,
//       orientation: req.body.orientation,
//       displaySize: req.body.displaySize,
//       source: req.body.source,
//       tags: req.body.tags,
//     });

//     photo = await photo.save();

//     res.send(photo);
//   });

//   router.put("/:id", [auth, admin, validateObjectId, validateBody(joiPhotoSchema)], async (req, res) => {
//     const photoCategory = await PhotoCategoryModel.findById(req.body.categoryId);
//     if (!photoCategory) return res.status(400).send("Invalid photo category.");

//     const updatedPhoto = await PhotoModel.findByIdAndUpdate(
//       req.params.id,
//       {
//         title: req.body.title,
//         category: photoCategory,
//         dateLastModified: moment().toJSON(),
//         description: req.body.description,
//         orientation: req.body.orientation,
//         displaySize: req.body.displaySize,
//         source: req.body.source,
//         tags: req.body.tags,
//       },
//       { new: true }
//     );

//     if (!updatedPhoto) return res.status(404).send("Photo not found.");

//     res.send(updatedPhoto);
//   });

//   router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
//     const photo = await PhotoModel.findByIdAndRemove(req.params.id);
//     if (!photo) return res.status(404).send("The photo with the given ID was not found.");

//     res.send(photo);
//   });

//   return router;
// };
