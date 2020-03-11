const request = require("supertest");
const { SoftwareCategory } = require("../../models/softwareCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/softwareCategories", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await SoftwareCategory.deleteMany({});
  });

  describe("GET /", () => {
    let softwareCategory1;
    let softwareCategory2;

    beforeEach(async () => {
      softwareCategory1 = new SoftwareCategory({ name: "Fiction", slug: "fiction" });
      softwareCategory1 = await softwareCategory1.save();

      softwareCategory2 = new SoftwareCategory({ name: "Non-Fiction", slug: "non-fiction" });
      softwareCategory2 = await softwareCategory2.save();
    });

    it("Should return all the software categories", async () => {
      const res = await request(server).get("/softwareCategories");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.name === softwareCategory1.name)).toBeTruthy();
      expect(res.body.items.some(g => g.name === softwareCategory2.name)).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return an software category if valid id is passed", async () => {
      let softwareCategory = new SoftwareCategory({ name: "Horror", slug: "horror" });
      softwareCategory = await softwareCategory.save();

      const res = await request(server).get("/softwareCategories/" + softwareCategory._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", softwareCategory.name);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/softwareCategories/-1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no software with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/softwareCategories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let softwareCategory;
    let token;

    const exec = () => {
      return request(server)
        .post("/softwareCategories")
        .set("x-auth-token", token)
        .send(softwareCategory);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      softwareCategory = { name: "Fiction", slug: "fiction" };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is less than 2 characters", async () => {
      softwareCategory.name = "t";

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      softwareCategory.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save if it is valid", async () => {
      await exec();

      const savedSoftwareCategory = await SoftwareCategory.find({ name: softwareCategory.name });
      expect(savedSoftwareCategory).not.toBeNull();
    });

    it("should return it if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", softwareCategory.name);
    });
  });

  describe("PUT /", () => {
    let existingSoftwareCategory;
    let softwareCategory;
    let token;
    let id;

    const exec = () => {
      return request(server)
        .put("/softwareCategories/" + id)
        .set("x-auth-token", token)
        .send(softwareCategory);
    };

    beforeEach(async () => {
      existingSoftwareCategory = new SoftwareCategory({ name: "Fiction", slug: "fiction" });
      existingSoftwareCategory = await existingSoftwareCategory.save();
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingSoftwareCategory._id;

      softwareCategory = {
        name: "Fantasy",
        slug: "fantasy"
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

    it("should return 404 if an existing software category with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 2 characters", async () => {
      softwareCategory.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      softwareCategory.title = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save it if it is valid", async () => {
      await exec();

      const savedSoftwareCategory = await SoftwareCategory.find({ name: softwareCategory.name });
      expect(savedSoftwareCategory).not.toBeNull();
    });

    it("should update it if input is valid", async () => {
      await exec();

      const updatedSoftwareCategory = await SoftwareCategory.findById(existingSoftwareCategory._id);

      expect(updatedSoftwareCategory.name).toBe(softwareCategory.name);
    });

    it("should return it if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", softwareCategory.name);
    });
  });

  describe("DELETE /", () => {
    let token;
    let softwareCategory;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/softwareCategories/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      softwareCategory = new SoftwareCategory({ name: "Folk", slug: "folk" });
      softwareCategory = await softwareCategory.save();
      id = softwareCategory._id;
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

    it("should return 404 if no software with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the software if input is valid", async () => {
      await exec();

      const savedSoftwareCategory = await SoftwareCategory.findById(id);
      expect(savedSoftwareCategory).toBeNull();
    });

    it("should return the removed software", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", softwareCategory.name);
    });
  });
});
