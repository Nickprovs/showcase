const express = require("express");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validateBody = require("../../middleware/validateBody");
const validateObjectId = require("../../middleware/validateObjectId");
const winston = require("winston");

module.exports = function(CategoryModel, categoryJoiSchema) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const categories = await CategoryModel.find()
      .select("-__v")
      .sort({ name: "asc" });

    const total = await CategoryModel.countDocuments({});
    const data = {
      total: total,
      items: categories
    };

    res.send(data);
  });

  router.get("/:id", validateObjectId, async (req, res) => {
    const category = await CategoryModel.findById(req.params.id).select("-__v");
    if (!category) return res.status(404).send("The article category with the given ID was not found.");

    res.send(category);
  });

  router.post("/", [auth, admin, validateBody(categoryJoiSchema)], async (req, res) => {
    let category = new CategoryModel({
      name: req.body.name
    });

    category = await category.save();

    res.send(category);
  });

  router.put("/:id", [auth, admin, validateObjectId, validateBody(categoryJoiSchema)], async (req, res) => {
    const updatedCategoryModel = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name
      },
      { new: true }
    );

    if (!updatedCategoryModel) return res.status(404).send("Article Category not found.");

    res.send(updatedCategoryModel);
  });

  router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const category = await CategoryModel.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).send("The article category with the given ID was not found.");

    res.send(category);
  });

  return router;
};
