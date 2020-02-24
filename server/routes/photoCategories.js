const express = require("express");
const { PhotoCategory, joiSchema: photoCategorySchema } = require("../models/photoCategory");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateObjectId = require("../middleware/validateObjectId");
const winston = require("winston");
const router = express.Router();

router.get("/", async (req, res) => {
  const photoCategories = await PhotoCategory.find()
    .select("-__v")
    .sort({ name: "asc" });

  const total = await PhotoCategory.count({});
  const data = {
    total: total,
    items: photoCategories
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const photoCategory = await PhotoCategory.findById(req.params.id).select("-__v");
  if (!photoCategory) return res.status(404).send("The photo category with the given ID was not found.");

  res.send(photoCategory);
});

router.post("/", [auth, admin, validateBody(photoCategorySchema)], async (req, res) => {
  let photoCategory = new PhotoCategory({
    name: req.body.name
  });

  photoCategory = await photoCategory.save();

  res.send(photoCategory);
});

router.put("/:id", [auth, admin, validateObjectId, validateBody(photoCategorySchema)], async (req, res) => {
  const updatedPhotoCategory = await PhotoCategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  );

  if (!updatedPhotoCategory) return res.status(404).send("Photo Category not found.");

  res.send(updatedPhotoCategory);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const photoCategory = await PhotoCategory.findByIdAndRemove(req.params.id);
  if (!photoCategory) return res.status(404).send("The photo category with the given ID was not found.");

  res.send(photoCategory);
});

module.exports = router;
