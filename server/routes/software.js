const express = require("express");
const moment = require("moment");
const { Software, schema: softwareSchema } = require("../models/software");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/software/getAllQuery");
const winston = require("winston");
const router = express.Router();

router.get("/", validateQuery(getAllQuerySchema), async (req, res) => {
  const dateOrder = req.query.dateOrder ? req.query.dateOrder : "desc";
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const total = await Software.count({});

  const software = await Software.find()
    .select("-__v -body")
    .sort({ datePosted: dateOrder })
    .skip(offset)
    .limit(limit);

  const data = {
    offset: offset,
    limit: limit,
    dateOrder: dateOrder,
    total: total,
    items: software
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const software = await Software.findById(req.params.id).select("-__v");
  if (!software) return res.status(404).send("The software with the given ID was not found.");

  res.send(software);
});

router.post("/", [auth, admin, validateBody(softwareSchema)], async (req, res) => {
  let software = new Software({
    slug: req.body.slug,
    title: req.body.title,
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    description: req.body.description,
    image: req.body.image,
    body: req.body.body
  });

  software = await software.save();

  res.send(software);
});

router.put("/:id", [auth, admin, validateObjectId, validateBody(softwareSchema)], async (req, res) => {
  const updatedSoftware = await Software.findByIdAndUpdate(
    req.params.id,
    {
      slug: req.body.slug,
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      body: req.body.body,
      dateLastModified: moment().toJSON()
    },
    { new: true }
  );

  if (!updatedSoftware) return res.status(404).send("Software not found.");

  res.send(updatedSoftware);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const software = await Software.findByIdAndRemove(req.params.id);
  if (!software) return res.status(404).send("The software with the given ID was not found.");

  res.send(software);
});

module.exports = router;
