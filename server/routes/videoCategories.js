const express = require("express");
const { VideoCategory, schema: videoCategorySchema } = require("../models/videoCategory");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateObjectId = require("../middleware/validateObjectId");
const winston = require("winston");
const router = express.Router();

router.get("/", async (req, res) => {
  const videoCategories = await VideoCategory.find()
    .select("-__v")
    .sort({ name: "asc" });

  const total = await VideoCategory.count({});
  const data = {
    total: total,
    items: videoCategories
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const videoCategory = await VideoCategory.findById(req.params.id).select("-__v");
  if (!videoCategory) return res.status(404).send("The video category with the given ID was not found.");

  res.send(videoCategory);
});

router.post("/", [auth, admin, validateBody(videoCategorySchema)], async (req, res) => {
  let videoCategory = new VideoCategory({
    name: req.body.name
  });

  videoCategory = await videoCategory.save();

  res.send(videoCategory);
});

router.put("/:id", [auth, admin, validateObjectId, validateBody(videoCategorySchema)], async (req, res) => {
  const updatedVideoCategory = await VideoCategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  );

  if (!updatedVideoCategory) return res.status(404).send("Video Category not found.");

  res.send(updatedVideoCategory);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const videoCategory = await VideoCategory.findByIdAndRemove(req.params.id);
  if (!videoCategory) return res.status(404).send("The video category with the given ID was not found.");

  res.send(videoCategory);
});

module.exports = router;
