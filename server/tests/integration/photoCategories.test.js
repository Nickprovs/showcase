const request = require("supertest");
const { PhotoCategory } = require("../../models/photoCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/photoCategories", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await PhotoCategory.deleteMany({});
  });

  describe("GET /", () => {
    let photoCategory1;
    let photoCategory2;

    beforeEach(async () => {
      photoCategory1 = new PhotoCategory({ name: "Fiction" });
      photoCategory1 = await photoCategory1.save();

      photoCategory2 = new PhotoCategory({ name: "Non-Fiction" });
      photoCategory2 = await photoCategory2.save();
    });

    it("Should return all the photo categories", async () => {
      const res = await request(server).get("/photoCategories");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.name === photoCategory1.name)).toBeTruthy();
      expect(res.body.items.some(g => g.name === photoCategory2.name)).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return an photo category if valid id is passed", async () => {
      let photoCategory = new PhotoCategory({ name: "Horror" });
      photoCategory = await photoCategory.save();

      const res = await request(server).get("/photoCategories/" + photoCategory._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", photoCategory.name);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/photoCategories/-1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no photo with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/photoCategories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let photoCategory;
    let token;

    const exec = () => {
      return request(server)
        .post("/photoCategories")
        .set("x-auth-token", token)
        .send(photoCategory);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      photoCategory = { name: "Fiction" };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is less than 2 characters", async () => {
      photoCategory.name = "t";

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      photoCategory.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save if it is valid", async () => {
      await exec();

      const savedPhotoCategory = await PhotoCategory.find({ name: photoCategory.name });
      expect(savedPhotoCategory).not.toBeNull();
    });

    it("should return it if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", photoCategory.name);
    });
  });

  describe("PUT /", () => {
    let existingPhotoCategory;
    let photoCategory;
    let token;
    let id;

    const exec = () => {
      return request(server)
        .put("/photoCategories/" + id)
        .set("x-auth-token", token)
        .send(photoCategory);
    };

    beforeEach(async () => {
      existingPhotoCategory = new PhotoCategory({ name: "Fiction" });
      existingPhotoCategory = await existingPhotoCategory.save();
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingPhotoCategory._id;

      photoCategory = {
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

    it("should return 404 if an existing photo category with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 2 characters", async () => {
      photoCategory.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      photoCategory.title = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save it if it is valid", async () => {
      await exec();

      const savedPhotoCategory = await PhotoCategory.find({ name: photoCategory.name });
      expect(savedPhotoCategory).not.toBeNull();
    });

    it("should update it if input is valid", async () => {
      await exec();

      const updatedPhotoCategory = await PhotoCategory.findById(existingPhotoCategory._id);

      expect(updatedPhotoCategory.name).toBe(photoCategory.name);
    });

    it("should return it if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", photoCategory.name);
    });
  });

  describe("DELETE /", () => {
    let token;
    let photoCategory;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/photoCategories/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      photoCategory = new PhotoCategory({ name: "Folk" });
      photoCategory = await photoCategory.save();
      id = photoCategory._id;
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

    it("should return 404 if no photo with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the photo if input is valid", async () => {
      await exec();

      const savedPhotoCategory = await PhotoCategory.findById(id);
      expect(savedPhotoCategory).toBeNull();
    });

    it("should return the removed photo", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", photoCategory.name);
    });
  });
});
