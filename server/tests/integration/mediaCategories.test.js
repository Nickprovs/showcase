const request = require("supertest");
const { VideoCategory } = require("../../models/mediaCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/mediaCategories", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await VideoCategory.deleteMany({});
  });

  describe("GET /", () => {
    let mediaCategory1;
    let mediaCategory2;

    beforeEach(async () => {
      mediaCategory1 = new VideoCategory({ name: "Fiction", slug: "fiction" });
      mediaCategory1 = await mediaCategory1.save();

      mediaCategory2 = new VideoCategory({ name: "Non-Fiction", slug: "non-fiction" });
      mediaCategory2 = await mediaCategory2.save();
    });

    it("Should return all the media categories", async () => {
      const res = await request(server).get("/mediaCategories");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some((g) => g.name === mediaCategory1.name)).toBeTruthy();
      expect(res.body.items.some((g) => g.name === mediaCategory2.name)).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return an media category if valid id is passed", async () => {
      let mediaCategory = new VideoCategory({ name: "Horror", slug: "horror" });
      mediaCategory = await mediaCategory.save();

      const res = await request(server).get("/mediaCategories/" + mediaCategory._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", mediaCategory.name);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/mediaCategories/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no media with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/mediaCategories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let mediaCategory;
    let token;

    const exec = () => {
      return request(server).post("/mediaCategories").set("x-auth-token", token).send(mediaCategory);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      mediaCategory = { name: "Fiction", slug: "fiction" };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is less than 2 characters", async () => {
      mediaCategory.name = "t";

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      mediaCategory.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save if it is valid", async () => {
      await exec();

      const savedVideoCategory = await VideoCategory.find({ name: mediaCategory.name });
      expect(savedVideoCategory).not.toBeNull();
    });

    it("should return it if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", mediaCategory.name);
    });
  });

  describe("PUT /", () => {
    let existingVideoCategory;
    let mediaCategory;
    let token;
    let id;

    const exec = () => {
      return request(server)
        .put("/mediaCategories/" + id)
        .set("x-auth-token", token)
        .send(mediaCategory);
    };

    beforeEach(async () => {
      existingVideoCategory = new VideoCategory({ name: "Fiction", slug: "fiction" });
      existingVideoCategory = await existingVideoCategory.save();
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingVideoCategory._id;

      mediaCategory = {
        name: "Fantasy",
        slug: "fantasy",
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

    it("should return 404 if an existing media category with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 2 characters", async () => {
      mediaCategory.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      mediaCategory.title = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save it if it is valid", async () => {
      await exec();

      const savedVideoCategory = await VideoCategory.find({ name: mediaCategory.name });
      expect(savedVideoCategory).not.toBeNull();
    });

    it("should update it if input is valid", async () => {
      await exec();

      const updatedVideoCategory = await VideoCategory.findById(existingVideoCategory._id);

      expect(updatedVideoCategory.name).toBe(mediaCategory.name);
    });

    it("should return it if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", mediaCategory.name);
    });
  });

  describe("DELETE /", () => {
    let token;
    let mediaCategory;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/mediaCategories/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      mediaCategory = new VideoCategory({ name: "Folk", slug: "folk" });
      mediaCategory = await mediaCategory.save();
      id = mediaCategory._id;
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

      const savedVideoCategory = await VideoCategory.findById(id);
      expect(savedVideoCategory).toBeNull();
    });

    it("should return the removed media", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", mediaCategory.name);
    });
  });
});
