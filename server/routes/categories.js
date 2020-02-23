const express = require("express");
const { Category, schema: categorySchema } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateObjectId = require("../middleware/validateObjectId");
const winston = require("winston");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find()
    .select("-__v")
    .sort({ name: "asc" });

  const total = await Category.count({});
  const data = {
    total: total,
    items: categories
  };

  res.send(data);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v");
  if (!category) return res.status(404).send("The category with the given ID was not found.");

  res.send(category);
});

router.post("/", [auth, admin, validateBody(categorySchema)], async (req, res) => {
  let category = new Category({
    name: req.body.name
  });

  category = await category.save();

  res.send(category);
});

router.put("/:id", [auth, admin, validateObjectId, validateBody(categorySchema)], async (req, res) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  );

  if (!updatedCategory) return res.status(404).send("Category not found.");

  res.send(updatedCategory);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  if (!category) return res.status(404).send("The category with the given ID was not found.");

  res.send(category);
});

module.exports = router;
