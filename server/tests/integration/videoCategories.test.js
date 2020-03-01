const request = require("supertest");
const { VideoCategory } = require("../../models/videoCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/videoCategories", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await VideoCategory.deleteMany({});
  });

  describe("GET /", () => {
    let videoCategory1;
    let videoCategory2;

    beforeEach(async () => {
      videoCategory1 = new VideoCategory({ name: "Fiction" });
      videoCategory1 = await videoCategory1.save();

      videoCategory2 = new VideoCategory({ name: "Non-Fiction" });
      videoCategory2 = await videoCategory2.save();
    });

    it("Should return all the video categories", async () => {
      const res = await request(server).get("/videoCategories");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.name === videoCategory1.name)).toBeTruthy();
      expect(res.body.items.some(g => g.name === videoCategory2.name)).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return an video category if valid id is passed", async () => {
      let videoCategory = new VideoCategory({ name: "Horror" });
      videoCategory = await videoCategory.save();

      const res = await request(server).get("/videoCategories/" + videoCategory._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", videoCategory.name);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/videoCategories/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no video with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/videoCategories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let videoCategory;
    let token;

    const exec = () => {
      return request(server)
        .post("/videoCategories")
        .set("x-auth-token", token)
        .send(videoCategory);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      videoCategory = { name: "Fiction" };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is less than 2 characters", async () => {
      videoCategory.name = "t";

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      videoCategory.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save if it is valid", async () => {
      await exec();

      const savedVideoCategory = await VideoCategory.find({ name: videoCategory.name });
      expect(savedVideoCategory).not.toBeNull();
    });

    it("should return it if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", videoCategory.name);
    });
  });

  describe("PUT /", () => {
    let existingVideoCategory;
    let videoCategory;
    let token;
    let id;

    const exec = () => {
      return request(server)
        .put("/videoCategories/" + id)
        .set("x-auth-token", token)
        .send(videoCategory);
    };

    beforeEach(async () => {
      existingVideoCategory = new VideoCategory({ name: "Fiction" });
      existingVideoCategory = await existingVideoCategory.save();
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingVideoCategory._id;

      videoCategory = {
        name: "Fantasy"
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

    it("should return 404 if an existing video category with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 2 characters", async () => {
      videoCategory.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      videoCategory.title = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save it if it is valid", async () => {
      await exec();

      const savedVideoCategory = await VideoCategory.find({ name: videoCategory.name });
      expect(savedVideoCategory).not.toBeNull();
    });

    it("should update it if input is valid", async () => {
      await exec();

      const updatedVideoCategory = await VideoCategory.findById(existingVideoCategory._id);

      expect(updatedVideoCategory.name).toBe(videoCategory.name);
    });

    it("should return it if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", videoCategory.name);
    });
  });

  describe("DELETE /", () => {
    let token;
    let videoCategory;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/videoCategories/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      videoCategory = new VideoCategory({ name: "Folk" });
      videoCategory = await videoCategory.save();
      id = videoCategory._id;
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

      const savedVideoCategory = await VideoCategory.findById(id);
      expect(savedVideoCategory).toBeNull();
    });

    it("should return the removed video", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", videoCategory.name);
    });
  });
});
