const express = require("express");
const moment = require("moment");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateBody = require("../middleware/validateBody");
const validateQuery = require("../middleware/validateQuery");
const { FeaturedModel, joiSchema: joiFeaturedModel } = require("../models/featured");
const { Article: ArticleModel } = require("../models/article");
const { Software: SoftwareModel } = require("../models/software");
const { PhotoModel } = require("../models/photo");
const { VideoModel } = require("../models/video");
const changeFeaturedArticleSchema = require("./schemas/body/featured/put/changeFeaturedArticle");
const changeFeaturedSoftwareSchema = require("./schemas/body/featured/put/changeFeaturedSoftware");
const changeFeaturedPhotoSchema = require("./schemas/body/featured/put/changeFeaturedPhoto");
const changeFeaturedVideoSchema = require("./schemas/body/featured/put/changeFeaturedVideo");
const winston = require("winston");

module.exports = function () {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const featured = await FeaturedModel.findOne();
    const article = await ArticleModel.findOne({ _id: featured.articleId });

    const data = {
      body: featured.body,
      article: article,
    };
    res.send(data);
  });

  router.get("/article", async (req, res) => {
    //The return -- null -- unless there's a featured article.
    let data = {
      article: null,
    };

    //Check existing featured article -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.articleId) return res.send(data);

    //If there's an existing featured article -- grab it.
    const matchingArticle = await ArticleModel.findOne({ _id: featured.articleId });
    if (!matchingArticle) return res.send(data);

    //Return the newly featured article
    data.article = matchingArticle;
    res.send(data);
  });

  router.put("/article", [auth, admin, validateBody(changeFeaturedArticleSchema)], async (req, res) => {
    //Make sure that article actually exists
    const matchingArticle = await ArticleModel.findOne({ _id: req.body.articleId }).select("-__v");
    if (!matchingArticle) return res.status(400).send("Invalid article id.");

    //Change the featured article id
    const featured = await FeaturedModel.findOne();
    featured.articleId = req.body.articleId;
    await featured.save();

    //Return updated article
    const data = {
      article: matchingArticle,
    };
    res.send(data);
  });

  router.delete("/article", [auth, admin], async (req, res) => {
    //The return will be the featured article if it exists.
    let data = {
      article: null,
    };

    //Check existing featured article -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.articleId) return res.send(data);
    const matchingArticle = await ArticleModel.findOne({ _id: featured.articleId });

    //Deletion
    featured.articleId = null;
    await featured.save();

    //Return what was deleted
    data.article = matchingArticle;
    res.send(data);
  });

  router.get("/software", async (req, res) => {
    //The return -- null -- unless there's a featured software.
    let data = {
      software: null,
    };

    //Check existing featured software -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.softwareId) return res.send(data);

    //If there's an existing featured software -- grab it.
    const matchingSoftware = await SoftwareModel.findOne({ _id: featured.softwareId });
    if (!matchingSoftware) return res.send(data);

    //Return the newly featured software
    data.software = matchingSoftware;
    res.send(data);
  });

  router.put("/software", [auth, admin, validateBody(changeFeaturedSoftwareSchema)], async (req, res) => {
    //Make sure that software actually exists
    const matchingSoftware = await SoftwareModel.findOne({ _id: req.body.softwareId }).select("-__v");
    if (!matchingSoftware) return res.status(400).send("Invalid software id.");

    //Change the featured software id
    const featured = await FeaturedModel.findOne();
    featured.softwareId = req.body.softwareId;
    await featured.save();

    //Return updated software
    const data = {
      software: matchingSoftware,
    };
    res.send(data);
  });

  router.delete("/software", [auth, admin], async (req, res) => {
    //The return will be the featured software if it exists.
    let data = {
      software: null,
    };

    //Check existing featured software -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.softwareId) return res.send(data);
    const matchingSoftware = await SoftwareModel.findOne({ _id: featured.softwareId });

    //Deletion
    featured.softwareId = null;
    await featured.save();

    //Return what was deleted
    data.software = matchingSoftware;
    res.send(data);
  });

  router.get("/photo", async (req, res) => {
    //The return -- null -- unless there's a featured photo.
    let data = {
      photo: null,
    };

    //Check existing featured photo -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.photoId) return res.send(data);

    //If there's an existing featured photo -- grab it.
    const matchingPhoto = await PhotoModel.findOne({ _id: featured.photoId });
    if (!matchingPhoto) return res.send(data);

    //Return the newly featured photo
    data.photo = matchingPhoto;
    res.send(data);
  });

  router.put("/photo", [auth, admin, validateBody(changeFeaturedPhotoSchema)], async (req, res) => {
    //Make sure that photo actually exists
    const matchingPhoto = await PhotoModel.findOne({ _id: req.body.photoId }).select("-__v");
    if (!matchingPhoto) return res.status(400).send("Invalid photo id.");

    //Change the featured photo id
    const featured = await FeaturedModel.findOne();
    featured.photoId = req.body.photoId;
    await featured.save();

    //Return updated photo
    const data = {
      photo: matchingPhoto,
    };
    res.send(data);
  });

  router.delete("/photo", [auth, admin], async (req, res) => {
    //The return will be the featured photo if it exists.
    let data = {
      photo: null,
    };

    //Check existing featured photo -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.photoId) return res.send(data);
    const matchingPhoto = await PhotoModel.findOne({ _id: featured.photoId });

    //Deletion
    featured.photoId = null;
    await featured.save();

    //Return what was deleted
    data.photo = matchingPhoto;
    res.send(data);
  });

  router.get("/video", async (req, res) => {
    //The return -- null -- unless there's a featured video.
    let data = {
      video: null,
    };

    //Check existing featured video -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.videoId) return res.send(data);

    //If there's an existing featured video -- grab it.
    const matchingVideo = await VideoModel.findOne({ _id: featured.videoId });
    if (!matchingVideo) return res.send(data);

    //Return the newly featured video
    data.video = matchingVideo;
    res.send(data);
  });

  router.put("/video", [auth, admin, validateBody(changeFeaturedVideoSchema)], async (req, res) => {
    //Make sure that video actually exists
    const matchingVideo = await VideoModel.findOne({ _id: req.body.videoId }).select("-__v");
    if (!matchingVideo) return res.status(400).send("Invalid video id.");

    //Change the featured video id
    const featured = await FeaturedModel.findOne();
    featured.videoId = req.body.videoId;
    await featured.save();

    //Return updated video
    const data = {
      video: matchingVideo,
    };
    res.send(data);
  });

  router.delete("/video", [auth, admin], async (req, res) => {
    //The return will be the featured video if it exists.
    let data = {
      video: null,
    };

    //Check existing featured video -- if there's none -- job done
    const featured = await FeaturedModel.findOne();
    if (!featured.videoId) return res.send(data);
    const matchingVideo = await VideoModel.findOne({ _id: featured.videoId });

    //Deletion
    featured.videoId = null;
    await featured.save();

    //Return what was deleted
    data.video = matchingVideo;
    res.send(data);
  });

  return router;
};
