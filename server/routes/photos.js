const express = require("express");
const moment = require("moment");
const { Photo, joiSchema: photoSchema } = require("../models/photo");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/photos/getAllQuery");
const winston = require("winston");
const router = express.Router();

router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
  const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const total = await Photo.count({});

  const photos = await Photo.find()
    .select("-__v -body")
    .sort({ datePosted: dateOrder })
    .skip(offset)
    .limit(limit);

  const data = {
    offset: offset,
    limit: limit,
    dateOrder: dateOrder,
    total: total,
    items: photos
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const photo = await Photo.findById(req.params.id).select("-__v");
  if (!photo) return res.status(404).send("The photo with the given ID was not found.");

  res.send(photo);
});

router.post("/", [auth, admin, validateBody(photoSchema)], async (req, res) => {
  let photo = new Photo({
    title: req.body.title,
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    orientation: req.body.orientation,
    displaySize: req.body.displaySize,
    source: req.body.source
  });

  photo = await photo.save();

  res.send(photo);
});

router.put("/:id", [auth, admin, validateObjectId, validateBody(photoSchema)], async (req, res) => {
  const updatedPhoto = await Photo.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      dateLastModified: moment().toJSON(),
      orientation: req.body.orientation,
      displaySize: req.body.displaySize,
      source: req.body.source
    },
    { new: true }
  );

  if (!updatedPhoto) return res.status(404).send("Photo not found.");

  res.send(updatedPhoto);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const photo = await Photo.findByIdAndRemove(req.params.id);
  if (!photo) return res.status(404).send("The photo with the given ID was not found.");

  res.send(photo);
});

module.exports = router;
