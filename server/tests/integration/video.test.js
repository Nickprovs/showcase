const request = require("supertest");
const { Video } = require("../../models/video");
const { VideoCategory } = require("../../models/videoCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/videos", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Video.deleteMany({});
    await VideoCategory.deleteMany({});
  });

  describe("GET /", () => {
    let videoCategory1;
    let videoCategory2;
    let video1;
    let video2;
    let video3;

    beforeEach(async () => {
      videoCategory1 = new VideoCategory({ name: "Mammal" });
      videoCategory1 = await videoCategory1.save();

      videoCategory2 = new VideoCategory({ name: "Reptile" });
      videoCategory2 = await videoCategory2.save();

      video1 = new Video({
        title: "Dog Video",
        category: videoCategory1,
        description: "A video of a dog.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["cute", "dog", "doggo", "common1", "common2"]
      });
      await video1.save();

      video2 = new Video({
        title: "Cat Video",
        category: videoCategory1,
        description: "A video of a cat.",
        orientation: "portrait",
        displaySize: "large",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "cat", "kitten", "common1", "common2"]
      });
      await video2.save();

      video3 = new Video({
        title: "Lizard Video",
        category: videoCategory2,
        description: "A video of a lizard.",
        orientation: "portrait",
        displaySize: "large",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "lizard", "lizards"]
      });
      await video3.save();
    });

    it("Should return all the videos when no query filter is provided", async () => {
      const res = await request(server).get("/videos");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(3);
      expect(res.body.items.some(g => g.title === video1.title)).toBeTruthy();
      expect(res.body.items.some(g => g.title === video2.title)).toBeTruthy();
      expect(res.body.items.some(g => g.title === video3.title)).toBeTruthy();
    });

    it("Should return the correct metadata when no query filter is provided", async () => {
      const res = await request(server).get("/videos");

      expect(res.body.total === 3);
      expect(res.body.offset === 0);
      expect(res.body.limit === 10);
    });

    it("Should return only the videos that match the category id filter", async () => {
      const res = await request(server).get(`/videos?categoryId=${videoCategory1._id}`);

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.title === video1.title)).toBeTruthy();
      expect(res.body.items.some(g => g.title === video2.title)).toBeTruthy();
    });

    it("Should return the correct metadata that matches the category id filter", async () => {
      const res = await request(server).get(`/videos?categoryId=${videoCategory1._id}`);

      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 2);
      expect(res.body.offset === 0);
      expect(res.body.limit === 10);
    });

    it("Should return the correct metadata when providing an offset", async () => {
      const res = await request(server).get(`/videos?offset=1`);

      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 3);
      expect(res.body.offset === 1);
      expect(res.body.limit === 10);
    });

    it("Should return the correct metadata that matches offset and the category id filter", async () => {
      const res = await request(server).get(`/videos?categoryId=${videoCategory1._id}&offset=1`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 2);
      expect(res.body.offset === 1);
      expect(res.body.limit === 10);
    });

    it("Should return the multiple of videos that match the description search", async () => {
      const res = await request(server).get(`/videos?search=a video of a`);

      //The items returned should nor have any results whose tags don't include "common1" or "common2"
      expect(res.body.items.length).toBe(3);
      expect(res.body.total === 3);
    });

    it("Should return the singular video that matches the tag search", async () => {
      const res = await request(server).get(`/videos?search=cat`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 1);
    });

    it("Should return the singular video that matches the title search", async () => {
      const res = await request(server).get(`/videos?search=cat`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 1);
    });

    it("Should return the multiple videos that matches the category search", async () => {
      const res = await request(server).get(`/videos?search=mammal`);
      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 2);
    });
  });

  describe("GET /:id", () => {
    it("should return a video if valid id is passed", async () => {
      let videoCategory = new VideoCategory({ name: "Portrait" });
      videoCategory = await videoCategory.save();

      const video = new Video({
        title: "Dog Video 1",
        category: videoCategory,
        description: "A video of a dog 1.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["one", "dog", "doggo"]
      });
      await video.save();
      const res = await request(server).get("/videos/" + video._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", video.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === video.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === video.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", video.description);
      expect(res.body).toHaveProperty("orientation", video.orientation);
      expect(res.body).toHaveProperty("displaySize", video.displaySize);
      expect(res.body).toHaveProperty("source", video.source);
      expect(res.body).toHaveProperty("tags");
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/videos/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no video with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/videos/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let video;
    let token;

    const exec = () => {
      return request(server)
        .post("/videos")
        .set("x-auth-token", token)
        .send(video);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();

      let videoCategory = new VideoCategory({ name: "Panorama" });
      videoCategory = await videoCategory.save();

      video = {
        title: "Dog Video 2",
        categoryId: videoCategory._id,
        description: "A video of a dog 2.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["Two", "dog", "doggo"]
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      video.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      video.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the video if it is valid", async () => {
      await exec();

      const postedAndSavedVideo = await Video.find({ title: video.title });

      expect(postedAndSavedVideo).not.toBeNull();
    });

    it("should return the video if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", video.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", video.description);
      expect(res.body).toHaveProperty("orientation", video.orientation);
      expect(res.body).toHaveProperty("displaySize", video.displaySize);
      expect(res.body).toHaveProperty("source", video.source);
      expect(res.body).toHaveProperty("tags");
    });
  });

  describe("PUT /", () => {
    let existingVideo;
    let video;
    let token;
    let id;
    let videoCategory;

    const exec = () => {
      return request(server)
        .put("/videos/" + id)
        .set("x-auth-token", token)
        .send(video);
    };

    beforeEach(async () => {
      videoCategory = new VideoCategory({ name: "Fiction" });
      videoCategory = await videoCategory.save();

      existingVideo = new Video({
        title: "Bunny Video",
        category: videoCategory,
        description: "A video of a bunny.",
        orientation: "portrait",
        displaySize: "small",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "bunny", "rabbit"]
      });
      await existingVideo.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingVideo._id;
      video = {
        title: "Big Bunny Video",
        categoryId: videoCategory._id,
        description: "A video of a big bunny.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/8vr8jT8.jpeg",
        tags: ["cute", "bunny", "rabbit"]
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the id is invalid", async () => {
      id = 1;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if an existing video with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      video.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      video.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the video if it is valid", async () => {
      await exec();

      const video = await Video.find({ title: "testtt1" });

      expect(video).not.toBeNull();
    });

    it("should update the video if input is valid", async () => {
      await exec();

      const updatedVideo = await Video.findById(existingVideo._id);

      expect(updatedVideo.title).toBe(video.title);
      expect(updatedVideo.description).toBe(video.description);
      expect(updatedVideo.orientation).toBe(video.orientation);
      expect(updatedVideo.displaySize).toBe(video.displaySize);
    });

    it("should return the updated video if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", video.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingVideo.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingVideo.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("description", video.description);
      expect(res.body).toHaveProperty("orientation", video.orientation);
      expect(res.body).toHaveProperty("displaySize", video.displaySize);
      expect(res.body).toHaveProperty("source", video.source);
      expect(res.body).toHaveProperty("tags", video.tags);
    });
  });

  describe("DELETE /", () => {
    let token;
    let video;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/videos/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      videoCategory = new VideoCategory({ name: "Candid" });
      videoCategory = await videoCategory.save();

      video = new Video({
        title: "Smol Bunny Video",
        category: videoCategory,
        description: "A video of a smol bunny.",
        orientation: "panorama",
        displaySize: "medium",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["smol", "bunny", "rabbit"]
      });
      await video.save();
      id = video._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 400 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if no video with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the video if input is valid", async () => {
      await exec();

      const videoInDb = await Video.findById(id);

      expect(videoInDb).toBeNull();
    });

    it("should return the removed video", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", video.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", video.description);
      expect(res.body).toHaveProperty("orientation", video.orientation);
      expect(res.body).toHaveProperty("displaySize", video.displaySize);
      expect(res.body).toHaveProperty("source", video.source);
      expect(res.body).toHaveProperty("tags");
    });
  });
});
