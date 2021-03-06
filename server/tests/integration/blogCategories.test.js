const request = require("supertest");
const { BlogCategory } = require("../../models/blogCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/blogCategories", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await BlogCategory.deleteMany({});
  });

  describe("GET /", () => {
    let articleCategory1;
    let articleCategory2;

    beforeEach(async () => {
      articleCategory1 = new BlogCategory({ name: "Fiction", slug: "fiction" });
      articleCategory1 = await articleCategory1.save();

      articleCategory2 = new BlogCategory({ name: "Non-Fiction", slug: "non-fiction" });
      articleCategory2 = await articleCategory2.save();
    });

    it("Should return all the article categories", async () => {
      const res = await request(server).get("/blogCategories");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some((g) => g.name === articleCategory1.name)).toBeTruthy();
      expect(res.body.items.some((g) => g.name === articleCategory2.name)).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return an article category if valid id is passed", async () => {
      let articleCategory = new BlogCategory({ name: "Horror", slug: "horror" });
      articleCategory = await articleCategory.save();

      const res = await request(server).get("/blogCategories/" + articleCategory._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", articleCategory.name);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/blogCategories/-1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no article with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/blogCategories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let articleCategory;
    let token;

    const exec = () => {
      return request(server).post("/blogCategories").set("x-auth-token", token).send(articleCategory);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      articleCategory = { name: "Fiction", slug: "fiction" };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is less than 2 characters", async () => {
      articleCategory.name = "t";

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      articleCategory.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save if it is valid", async () => {
      await exec();

      const savedArticleCategory = await BlogCategory.find({ name: articleCategory.name });
      expect(savedArticleCategory).not.toBeNull();
    });

    it("should return it if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", articleCategory.name);
    });
  });

  describe("PUT /", () => {
    let existingArticleCategory;
    let articleCategory;
    let token;
    let id;

    const exec = () => {
      return request(server)
        .put("/blogCategories/" + id)
        .set("x-auth-token", token)
        .send(articleCategory);
    };

    beforeEach(async () => {
      existingArticleCategory = new BlogCategory({ name: "Fiction", slug: "fiction" });
      existingArticleCategory = await existingArticleCategory.save();
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingArticleCategory._id;

      articleCategory = {
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

    it("should return 404 if an existing article category with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 2 characters", async () => {
      articleCategory.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      articleCategory.title = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save it if it is valid", async () => {
      await exec();

      const savedArticleCategory = await BlogCategory.find({ name: articleCategory.name });
      expect(savedArticleCategory).not.toBeNull();
    });

    it("should update it if input is valid", async () => {
      await exec();

      const updatedArticleCategory = await BlogCategory.findById(existingArticleCategory._id);

      expect(updatedArticleCategory.name).toBe(articleCategory.name);
    });

    it("should return it if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", articleCategory.name);
    });
  });

  describe("DELETE /", () => {
    let token;
    let articleCategory;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/blogCategories/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      articleCategory = new BlogCategory({ name: "Folk", slug: "folk" });
      articleCategory = await articleCategory.save();
      id = articleCategory._id;
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

    it("should return 404 if no article with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the article if input is valid", async () => {
      await exec();

      const savedArticleCategory = await BlogCategory.findById(id);
      expect(savedArticleCategory).toBeNull();
    });

    it("should return the removed article", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", articleCategory.name);
    });
  });
});
