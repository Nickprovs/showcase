const request = require("supertest");
const { Video } = require("../../models/media");
const { VideoCategory } = require("../../models/mediaCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/medias", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Video.deleteMany({});
    await VideoCategory.deleteMany({});
  });

  describe("GET /", () => {
    let mediaCategory1;
    let mediaCategory2;
    let media1;
    let media2;
    let media3;

    beforeEach(async () => {
      mediaCategory1 = new VideoCategory({ name: "Mammal", slug: "mammal" });
      mediaCategory1 = await mediaCategory1.save();

      mediaCategory2 = new VideoCategory({ name: "Reptile", slug: "reptile" });
      mediaCategory2 = await mediaCategory2.save();

      media1 = new Video({
        title: "Dog Video",
        category: mediaCategory1,
        description: "A media of a dog.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["cute", "dog", "doggo", "common1", "common2"],
      });
      await media1.save();

      media2 = new Video({
        title: "Cat Video",
        category: mediaCategory1,
        description: "A media of a cat.",
        orientation: "portrait",
        displaySize: "large",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "cat", "kitten", "common1", "common2"],
      });
      await media2.save();

      media3 = new Video({
        title: "Lizard Video",
        category: mediaCategory2,
        description: "A media of a lizard.",
        orientation: "portrait",
        displaySize: "large",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "lizard", "lizards"],
      });
      await media3.save();
    });

    it("Should return all the medias when no query filter is provided", async () => {
      const res = await request(server).get("/medias");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(3);
      expect(res.body.items.some((g) => g.title === media1.title)).toBeTruthy();
      expect(res.body.items.some((g) => g.title === media2.title)).toBeTruthy();
      expect(res.body.items.some((g) => g.title === media3.title)).toBeTruthy();
    });

    it("Should return the correct metadata when no query filter is provided", async () => {
      const res = await request(server).get("/medias");

      expect(res.body.total === 3);
      expect(res.body.offset === 0);
      expect(res.body.limit === 10);
    });

    it("Should return only the medias that match the category id filter", async () => {
      const res = await request(server).get(`/medias?categoryId=${mediaCategory1._id}`);

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some((g) => g.title === media1.title)).toBeTruthy();
      expect(res.body.items.some((g) => g.title === media2.title)).toBeTruthy();
    });

    it("Should return the correct metadata that matches the category id filter", async () => {
      const res = await request(server).get(`/medias?categoryId=${mediaCategory1._id}`);

      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 2);
      expect(res.body.offset === 0);
      expect(res.body.limit === 10);
    });

    it("Should return the correct metadata when providing an offset", async () => {
      const res = await request(server).get(`/medias?offset=1`);

      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 3);
      expect(res.body.offset === 1);
      expect(res.body.limit === 10);
    });

    it("Should return the correct metadata that matches offset and the category id filter", async () => {
      const res = await request(server).get(`/medias?categoryId=${mediaCategory1._id}&offset=1`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 2);
      expect(res.body.offset === 1);
      expect(res.body.limit === 10);
    });

    it("Should return the multiple of medias that match the description search", async () => {
      const res = await request(server).get(`/medias?search=a media of a`);

      //The items returned should nor have any results whose tags don't include "common1" or "common2"
      expect(res.body.items.length).toBe(3);
      expect(res.body.total === 3);
    });

    it("Should return the singular media that matches the tag search", async () => {
      const res = await request(server).get(`/medias?search=cat`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 1);
    });

    it("Should return the singular media that matches the title search", async () => {
      const res = await request(server).get(`/medias?search=cat`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 1);
    });

    it("Should return the multiple medias that matches the category search", async () => {
      const res = await request(server).get(`/medias?search=mammal`);
      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 2);
    });
  });

  describe("GET /:id", () => {
    it("should return a media if valid id is passed", async () => {
      let mediaCategory = new VideoCategory({ name: "Portrait", slug: "portrait" });
      mediaCategory = await mediaCategory.save();

      const media = new Video({
        title: "Dog Video 1",
        category: mediaCategory,
        description: "A media of a dog 1.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["one", "dog", "doggo"],
      });
      await media.save();
      const res = await request(server).get("/medias/" + media._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", media.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === media.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === media.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", media.description);
      expect(res.body).toHaveProperty("orientation", media.orientation);
      expect(res.body).toHaveProperty("displaySize", media.displaySize);
      expect(res.body).toHaveProperty("source", media.source);
      expect(res.body).toHaveProperty("tags");
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/medias/-1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no media with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/medias/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let media;
    let token;

    const exec = () => {
      return request(server).post("/medias").set("x-auth-token", token).send(media);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();

      let mediaCategory = new VideoCategory({ name: "Panorama", slug: "panorama" });
      mediaCategory = await mediaCategory.save();

      media = {
        title: "Dog Video 2",
        categoryId: mediaCategory._id,
        description: "A media of a dog 2.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["Two", "dog", "doggo"],
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      media.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      media.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the media if it is valid", async () => {
      await exec();

      const postedAndSavedVideo = await Video.find({ title: media.title });

      expect(postedAndSavedVideo).not.toBeNull();
    });

    it("should return the media if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", media.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", media.description);
      expect(res.body).toHaveProperty("orientation", media.orientation);
      expect(res.body).toHaveProperty("displaySize", media.displaySize);
      expect(res.body).toHaveProperty("source", media.source);
      expect(res.body).toHaveProperty("tags");
    });
  });

  describe("PUT /", () => {
    let existingVideo;
    let media;
    let token;
    let id;
    let mediaCategory;

    const exec = () => {
      return request(server)
        .put("/medias/" + id)
        .set("x-auth-token", token)
        .send(media);
    };

    beforeEach(async () => {
      mediaCategory = new VideoCategory({ name: "Fiction", slug: "fiction" });
      mediaCategory = await mediaCategory.save();

      existingVideo = new Video({
        title: "Bunny Video",
        category: mediaCategory,
        description: "A media of a bunny.",
        orientation: "portrait",
        displaySize: "small",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "bunny", "rabbit"],
      });
      await existingVideo.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingVideo._id;
      media = {
        title: "Big Bunny Video",
        categoryId: mediaCategory._id,
        description: "A media of a big bunny.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/8vr8jT8.jpeg",
        tags: ["cute", "bunny", "rabbit"],
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

    it("should return 404 if an existing media with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      media.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      media.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the media if it is valid", async () => {
      await exec();

      const media = await Video.find({ title: "testtt1" });

      expect(media).not.toBeNull();
    });

    it("should update the media if input is valid", async () => {
      await exec();

      const updatedVideo = await Video.findById(existingVideo._id);

      expect(updatedVideo.title).toBe(media.title);
      expect(updatedVideo.description).toBe(media.description);
      expect(updatedVideo.orientation).toBe(media.orientation);
      expect(updatedVideo.displaySize).toBe(media.displaySize);
    });

    it("should return the updated media if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", media.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingVideo.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingVideo.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("description", media.description);
      expect(res.body).toHaveProperty("orientation", media.orientation);
      expect(res.body).toHaveProperty("displaySize", media.displaySize);
      expect(res.body).toHaveProperty("source", media.source);
      expect(res.body).toHaveProperty("tags", media.tags);
    });
  });

  describe("DELETE /", () => {
    let token;
    let media;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/medias/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      mediaCategory = new VideoCategory({ name: "Candid", slug: "candid" });
      mediaCategory = await mediaCategory.save();

      media = new Video({
        title: "Smol Bunny Video",
        category: mediaCategory,
        description: "A media of a smol bunny.",
        orientation: "panorama",
        displaySize: "medium",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["smol", "bunny", "rabbit"],
      });
      await media.save();
      id = media._id;
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

    it("should return 404 if no media with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the media if input is valid", async () => {
      await exec();

      const mediaInDb = await Video.findById(id);

      expect(mediaInDb).toBeNull();
    });

    it("should return the removed media", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", media.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", media.description);
      expect(res.body).toHaveProperty("orientation", media.orientation);
      expect(res.body).toHaveProperty("displaySize", media.displaySize);
      expect(res.body).toHaveProperty("source", media.source);
      expect(res.body).toHaveProperty("tags");
    });
  });
});
