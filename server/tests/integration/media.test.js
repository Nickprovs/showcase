const request = require("supertest");
const { MediaModel } = require("../../models/media");
const { MediaCategoryModel } = require("../../models/mediaCategory");
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
    await MediaModel.deleteMany({});
    await MediaCategoryModel.deleteMany({});
  });

  describe("GET /", () => {
    let mediaCategory1;
    let mediaCategory2;
    let media1;
    let media2;
    let media3;

    beforeEach(async () => {
      mediaCategory1 = new MediaCategoryModel({ name: "Mammal", slug: "mammal" });
      mediaCategory1 = await mediaCategory1.save();

      mediaCategory2 = new MediaCategoryModel({ name: "Reptile", slug: "reptile" });
      mediaCategory2 = await mediaCategory2.save();

      media1 = new MediaModel({
        title: "Dog Media",
        category: mediaCategory1,
        description: "A media of a dog.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        tags: ["cute", "dog", "doggo", "common1", "common2"],
      });
      await media1.save();

      media2 = new MediaModel({
        title: "Cat Media",
        category: mediaCategory1,
        description: "A media of a cat.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        tags: ["cute", "cat", "kitten", "common1", "common2"],
      });
      await media2.save();

      media3 = new MediaModel({
        title: "Lizard Media",
        category: mediaCategory2,
        description: "A media of a lizard.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
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
      const res = await request(server).get(`/medias?category=${mediaCategory1._id}`);

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some((g) => g.title === media1.title)).toBeTruthy();
      expect(res.body.items.some((g) => g.title === media2.title)).toBeTruthy();
    });

    it("Should return the correct metadata that matches the category id filter", async () => {
      const res = await request(server).get(`/medias?category=${mediaCategory1._id}`);

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
      const res = await request(server).get(`/medias?category=${mediaCategory1._id}&offset=1`);

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
      let mediaCategory = new MediaCategoryModel({ name: "Portrait", slug: "portrait" });
      mediaCategory = await mediaCategory.save();

      const media = new MediaModel({
        title: "Dog Media 1",
        category: mediaCategory,
        description: "A media of a dog 1.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
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
      expect(res.body).toHaveProperty("markup", media.markup);
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

      let mediaCategory = new MediaCategoryModel({ name: "Panorama", slug: "panorama" });
      mediaCategory = await mediaCategory.save();

      media = {
        title: "Dog Media 2",
        categoryId: mediaCategory._id,
        description: "A media of a dog 2.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
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

      const postedAndSavedMedia = await MediaModel.find({ title: media.title });

      expect(postedAndSavedMedia).not.toBeNull();
    });

    it("should return the media if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", media.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", media.description);
      expect(res.body).toHaveProperty("markup");
      expect(res.body).toHaveProperty("tags");
    });
  });

  describe("PUT /", () => {
    let existingMedia;
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
      mediaCategory = new MediaCategoryModel({ name: "Fiction", slug: "fiction" });
      mediaCategory = await mediaCategory.save();

      existingMedia = new MediaModel({
        title: "Bunny Media",
        category: mediaCategory,
        description: "A media of a bunny.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        tags: ["cute", "bunny", "rabbit"],
      });
      await existingMedia.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingMedia._id;
      media = {
        title: "Big Bunny Media",
        categoryId: mediaCategory._id,
        description: "A media of a big bunny.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
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

      const media = await MediaModel.find({ title: "testtt1" });

      expect(media).not.toBeNull();
    });

    it("should update the media if input is valid", async () => {
      await exec();

      const updatedMedia = await MediaModel.findById(existingMedia._id);

      expect(updatedMedia.title).toBe(media.title);
      expect(updatedMedia.description).toBe(media.description);
    });

    it("should return the updated media if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", media.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingMedia.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingMedia.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("description", media.description);
      expect(res.body).toHaveProperty("markup");
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
      mediaCategory = new MediaCategoryModel({ name: "Candid", slug: "candid" });
      mediaCategory = await mediaCategory.save();

      media = new MediaModel({
        title: "Smol Bunny Media",
        category: mediaCategory,
        description: "A media of a smol bunny.",
        markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/jxGrbtGmxnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
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

      const mediaInDb = await MediaModel.findById(id);

      expect(mediaInDb).toBeNull();
    });

    it("should return the removed media", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", media.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", media.description);
      expect(res.body).toHaveProperty("markup");
      expect(res.body).toHaveProperty("tags");
    });
  });
});
