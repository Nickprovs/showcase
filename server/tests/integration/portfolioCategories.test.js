const request = require("supertest");
const { PortfolioCategory } = require("../../models/portfolioCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server, teardown;
describe("/portfolioCategories", () => {
  beforeAll(() => {
    ({ server, teardown } = require("../../index"));
  });
  afterEach(async () => {
    await PortfolioCategory.deleteMany({});
  });
  afterAll(async ()=> {
    await teardown();
  });

  describe("GET /", () => {
    let portfolioCategory1;
    let portfolioCategory2;

    beforeEach(async () => {
      portfolioCategory1 = new PortfolioCategory({ name: "Fiction", slug: "fiction" });
      portfolioCategory1 = await portfolioCategory1.save();

      portfolioCategory2 = new PortfolioCategory({ name: "Non-Fiction", slug: "non-fiction" });
      portfolioCategory2 = await portfolioCategory2.save();
    });

    it("Should return all the portfolio categories", async () => {
      const res = await request(server).get("/portfolioCategories");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some((g) => g.name === portfolioCategory1.name)).toBeTruthy();
      expect(res.body.items.some((g) => g.name === portfolioCategory2.name)).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return an portfolio category if valid id is passed", async () => {
      let portfolioCategory = new PortfolioCategory({ name: "Horror", slug: "horror" });
      portfolioCategory = await portfolioCategory.save();

      const res = await request(server).get("/portfolioCategories/" + portfolioCategory._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", portfolioCategory.name);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/portfolioCategories/-1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no portfolio with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/portfolioCategories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let portfolioCategory;
    let token;

    const exec = () => {
      return request(server).post("/portfolioCategories").set("x-auth-token", token).send(portfolioCategory);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      portfolioCategory = { name: "Fiction", slug: "fiction" };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if category name is less than 2 characters", async () => {
      portfolioCategory.name = "t";

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      portfolioCategory.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save if it is valid", async () => {
      await exec();

      const savedPortfolioCategory = await PortfolioCategory.find({ name: portfolioCategory.name });
      expect(savedPortfolioCategory).not.toBeNull();
    });

    it("should return it if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", portfolioCategory.name);
    });
  });

  describe("PUT /", () => {
    let existingPortfolioCategory;
    let portfolioCategory;
    let token;
    let id;

    const exec = () => {
      return request(server)
        .put("/portfolioCategories/" + id)
        .set("x-auth-token", token)
        .send(portfolioCategory);
    };

    beforeEach(async () => {
      existingPortfolioCategory = new PortfolioCategory({ name: "Fiction", slug: "fiction" });
      existingPortfolioCategory = await existingPortfolioCategory.save();
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingPortfolioCategory._id;

      portfolioCategory = {
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

    it("should return 404 if an existing portfolio category with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 2 characters", async () => {
      portfolioCategory.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      portfolioCategory.title = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save it if it is valid", async () => {
      await exec();

      const savedPortfolioCategory = await PortfolioCategory.find({ name: portfolioCategory.name });
      expect(savedPortfolioCategory).not.toBeNull();
    });

    it("should update it if input is valid", async () => {
      await exec();

      const updatedPortfolioCategory = await PortfolioCategory.findById(existingPortfolioCategory._id);

      expect(updatedPortfolioCategory.name).toBe(portfolioCategory.name);
    });

    it("should return it if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", portfolioCategory.name);
    });
  });

  describe("DELETE /", () => {
    let token;
    let portfolioCategory;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/portfolioCategories/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      portfolioCategory = new PortfolioCategory({ name: "Folk", slug: "folk" });
      portfolioCategory = await portfolioCategory.save();
      id = portfolioCategory._id;
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

    it("should return 404 if no portfolio with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the portfolio if input is valid", async () => {
      await exec();

      const savedPortfolioCategory = await PortfolioCategory.findById(id);
      expect(savedPortfolioCategory).toBeNull();
    });

    it("should return the removed portfolio", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", portfolioCategory.name);
    });
  });
});
