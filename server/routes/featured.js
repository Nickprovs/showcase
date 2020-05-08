const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const validateObjectId = require("../middleware/validateObjectId");
const getAllQuerySchema = require("./schemas/queries/photo/getAllQuery");

const { Article } = require("../models/article");
const { FeaturedModel, joiSchema: joiFeaturedModel } = require("../models/featured");
const changeFeaturedArticleSchema = require("./schemas/body/featured/put/changeFeaturedArticle");
const ValidationUtilities = require("../util/validationUtilities");
const winston = require("winston");

module.exports = function () {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const featured = await FeaturedModel.findOne();
    const article = await Article.findOne({ _id: featured.articleId });

    const data = {
      article: article,
    };
    res.send(data);
  });

  router.put("/article", auth, admin, validateBody(changeFeaturedArticleSchema), async (req, res) => {
    //Make sure that article actually exists
    const matchingArticle = await Article.findOne({ _id: req.body.articleId });
    if (!matchingArticle) return res.status(400).send("Invalid article id.");

    //Change the featured article id
    const featured = await FeaturedModel.findOne();
    featured.articleId = req.body.articleId;
    await featured.save();

    //The updated article
    const data = {
      article: matchingArticle,
    };

    //Return the newly featured article
    res.send(data);
  });

  router.delete("/article", auth, admin, async (req, res) => {
    //The return -- null -- null unless there's already a featured article.
    let data = {
      article: null,
    };

    //Check existing featured article -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    featured.articleId = req.body.articleId;
    if (!featured.articleId) {
      return res.send(data);
    }

    //If there's an existing featured article -- grab it.
    const matchingArticle = await Article.findOne({ _id: req.body.articleId });
    if (!matchingArticle) {
      return res.send(data);
    }

    //Delete featured article
    featured.articleId = null;
    await featured.save();

    //Return the newly featured article
    res.send(matchingArticle);
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
