const request = require("supertest");
const { Portfolio } = require("../../models/portfolio");
const { PortfolioCategory } = require("../../models/portfolioCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server, teardown;
describe("/portfolio", () => {
  beforeAll(() => {
    ({ server, teardown } = require("../../index"));
  });
  afterEach(async () => {
    await Portfolio.deleteMany({});
    await PortfolioCategory.deleteMany({});
  });
  afterAll(async ()=> {
    await teardown();
  });

  describe("GET /", () => {
    let portfolioCategory1;
    let portfolioCategory2;
    let portfolio1;
    let portfolio2;
    let portfolio3;

    beforeEach(async () => {
      portfolioCategory1 = new PortfolioCategory({ name: "Fiction", slug: "fiction" });
      portfolioCategory1 = await portfolioCategory1.save();

      portfolioCategory2 = new PortfolioCategory({ name: "Non-Fiction", slug: "non-fiction" });
      portfolioCategory2 = await portfolioCategory2.save();

      portfolio1 = new Portfolio({
        slug: "the-great-cow-jumped-over-the-moon",
        title: "The great cow jumped over the moon",
        category: portfolioCategory1,
        description: "The cowiest of cows.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        tags: ["the", "great", "cow", "common1", "common2"],
      });
      await portfolio1.save();

      portfolio2 = new Portfolio({
        slug: "the-dog-jumped-over-the-fence",
        title: "The dog jumped over the fence",
        category: portfolioCategory2,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadasfsfsfsfsfsfsfsda",
        tags: ["the", "great", "cow", "common1", "common2"],
      });
      await portfolio2.save();

      portfolio3 = new Portfolio({
        slug: "the-beaver-jumped-over-the-fence",
        title: "The beaver jumped over the fence",
        category: portfolioCategory2,
        description: "The beaveriest of beavers.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadasfsfsfsfsfsfsfsda",
        tags: ["the", "beaver", "beav"],
      });
      await portfolio3.save();
    });

    it("Should return all the portfolio when no query filter is provided", async () => {
      const res = await request(server).get("/portfolio");

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(3);
      expect(res.body.items.some((g) => g.title === portfolio1.title)).toBeTruthy();
      expect(res.body.items.some((g) => g.title === portfolio2.title)).toBeTruthy();
      expect(res.body.items.some((g) => g.title === portfolio3.title)).toBeTruthy();
    });

    it("Should return the correct metadata when no query filter is provided", async () => {
      const res = await request(server).get("/portfolio");

      expect(res.body.total === 3);
      expect(res.body.offset === 0);
      expect(res.body.limit === 10);
    });

    it("Should return only the portfolio that match the category id filter", async () => {
      const res = await request(server).get(`/portfolio?category=${portfolioCategory2._id}`);

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some((g) => g.title === portfolio2.title)).toBeTruthy();
      expect(res.body.items.some((g) => g.title === portfolio3.title)).toBeTruthy();
    });

    it("Should return the correct metadata that matches the category id filter", async () => {
      const res = await request(server).get(`/portfolio?category=${portfolioCategory2._id}`);

      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 2);
      expect(res.body.offset === 0);
      expect(res.body.limit === 10);
    });

    it("Should return the correct metadata when providing an offset", async () => {
      const res = await request(server).get(`/portfolio?offset=1`);

      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 3);
      expect(res.body.offset === 1);
      expect(res.body.limit === 10);
    });

    it("Should return the correct metadata that matches offset and the category id filter", async () => {
      const res = await request(server).get(`/portfolio?category=${portfolioCategory2._id}&offset=1`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 2);
      expect(res.body.offset === 1);
      expect(res.body.limit === 10);
    });

    it("Should return the multiple of portfolio that match the tag search", async () => {
      const res = await request(server).get(`/portfolio?search=common1`);

      //The items returned should nor have any results whose tags don't include "common1" or "common2"
      expect(res.body.items.length).toBe(2);
      expect(res.body.total === 2);
    });

    it("Should return the singular portfolio that matches the tag search", async () => {
      const res = await request(server).get(`/portfolio?search=beaver`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 1);
    });

    it("Should return the singular portfolio that matches the title search", async () => {
      const res = await request(server).get(`/portfolio?search=dog`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 1);
    });

    it("Should return the multiple portfolio that matches the title search", async () => {
      const res = await request(server).get(`/portfolio?search=jumped`);

      expect(res.body.items.length).toBe(3);
      expect(res.body.total === 3);
    });

    it("Should return the singular photo that matches the description search", async () => {
      const res = await request(server).get(`/portfolio?search=cowiest`);

      expect(res.body.items.length).toBe(1);
      expect(res.body.total === 1);
    });
  });

  describe("GET /:id", () => {
    it("should return a portfolio if valid id is passed", async () => {
      let portfolioCategory = new PortfolioCategory({ name: "Fiction", slug: "fiction" });
      portfolioCategory = await portfolioCategory.save();

      const portfolio = new Portfolio({
        slug: "the-great-cow-jumped-over-the-moon",
        title: "The great cow jumped over the moon",
        category: portfolioCategory,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        addressableHighlights: [
          {
            label: "Cool Search Engine",
            address: "www.google.com",
          },
        ],
        tags: ["the", "great", "cow"],
      });
      await portfolio.save();
      const res = await request(server).get("/portfolio/" + portfolio._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", portfolio.slug);
      expect(res.body).toHaveProperty("title", portfolio.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === portfolio.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === portfolio.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", portfolio.description);
      expect(res.body).toHaveProperty("image", portfolio.image);
      expect(res.body).toHaveProperty("body", portfolio.body);
      expect(res.body).toHaveProperty("addressableHighlights");
      expect(res.body).toHaveProperty("tags");
      expect(res.body).toHaveProperty("contingency");
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/portfolio/A###1-");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no portfolio with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/portfolio/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let portfolio;
    let token;

    const exec = () => {
      return request(server).post("/portfolio").set("x-auth-token", token).send(portfolio);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();

      let portfolioCategory = new PortfolioCategory({ name: "Fiction", slug: "fiction" });
      portfolioCategory = await portfolioCategory.save();

      portfolio = {
        slug: "the-dogiest-of-dogs",
        title: "The dogiest of dogs",
        categoryId: portfolioCategory._id,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        addressableHighlights: [
          {
            label: "Cool Search Engine",
            address: "www.google.com",
          },
        ],
        tags: ["The", "Dogiest", "Dog"],
        contingency: {
          key1: "hey",
          key2: "world",
          key3: "what's up",
        },
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      portfolio.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      portfolio.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if the slug is invalid", async () => {
      portfolio.slug = "@aiodadkn=affns";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the portfolio if it is valid", async () => {
      await exec();

      const portfolio = await Portfolio.find({ title: "The dogiest of dogs" });

      expect(portfolio).not.toBeNull();
    });

    it("should return the portfolio if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", portfolio.slug);
      expect(res.body).toHaveProperty("title", portfolio.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", portfolio.description);
      expect(res.body).toHaveProperty("image", portfolio.image);
      expect(res.body).toHaveProperty("body", portfolio.body);
      expect(res.body).toHaveProperty("tags");
      expect(res.body).toHaveProperty("contingency", portfolio.contingency);
      expect(res.body).toHaveProperty("addressableHighlights");
    });
  });

  describe("PUT /:id", () => {
    let existingPortfolio;
    let portfolio;
    let token;
    let id;
    let portfolioCategory;

    const exec = () => {
      return request(server)
        .put("/portfolio/" + id)
        .set("x-auth-token", token)
        .send(portfolio);
    };

    beforeEach(async () => {
      portfolioCategory = new PortfolioCategory({ name: "Fiction", slug: "fiction" });
      portfolioCategory = await portfolioCategory.save();

      existingPortfolio = new Portfolio({
        slug: "the-original-dogiest-of-dogs",
        title: "The original dogiest of dogs",
        category: portfolioCategory,
        description: "The original dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaadeeadada",
        tags: ["The", "Dogiest", "Dog"],
        addressableHighlights: [
          {
            label: "Cool Search Engine",
            address: "www.google.com",
          },
        ],
        contingency: {
          key1: "Hi",
          key2: "What's good?",
          key3: "This is wack!",
        },
      });
      await existingPortfolio.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingPortfolio._id;
      portfolio = {
        slug: "the-updated-dogiest-of-dogs",
        title: "The updated dogiest of dogs",
        categoryId: portfolioCategory._id,
        description: "The updated dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaaabbbbbccccddddeeeffffadada",
        tags: ["The", "Dogiest", "Dog"],
        addressableHighlights: [
          {
            label: "Bad Search Engine",
            address: "www.bing.com",
          },
        ],
        contingency: {
          key1: "THIS IS EDITED",
          key2: "WOWWWW",
          key3: "CRAZY",
          key4: "A new key was added too!!!",
        },
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the id is invalid", async () => {
      id = -1;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if an existing portfolio with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      portfolio.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      portfolio.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if the slug is invalid", async () => {
      portfolio.slug = "@aiodadkn=affns";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the portfolio if it is valid", async () => {
      await exec();

      const portfolio = await Portfolio.find({ title: "testtt1" });

      expect(portfolio).not.toBeNull();
    });

    it("should update the portfolio if input is valid", async () => {
      await exec();

      const updatedPortfolio = await Portfolio.findById(existingPortfolio._id);

      expect(updatedPortfolio.name).toBe(portfolio.name);
      expect(updatedPortfolio.contingency.get("key4")).toBeTruthy();
    });

    it("should return the updated portfolio if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("slug", portfolio.slug);
      expect(res.body).toHaveProperty("title", portfolio.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingPortfolio.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingPortfolio.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("description", portfolio.description);
      expect(res.body).toHaveProperty("image", portfolio.image);
      expect(res.body).toHaveProperty("body", portfolio.body);
      expect(res.body).toHaveProperty("tags", portfolio.tags);
      expect(res.body).toHaveProperty("contingency", portfolio.contingency);
      expect(res.body).toHaveProperty("addressableHighlights", portfolio.addressableHighlights);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let portfolio;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/portfolio/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      portfolioCategory = new PortfolioCategory({ name: "Fiction", slug: "fiction" });
      portfolioCategory = await portfolioCategory.save();

      portfolio = new Portfolio({
        slug: "the-best-dogiest-of-dogs",
        title: "The best dogiest of dogs",
        category: portfolioCategory,
        description: "The best dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaadeeadada",
        tags: ["The", "Dogiest", "Dog"],
        addressableHighlights: [
          {
            label: "Bad Search Engine",
            address: "www.bing.com",
          },
        ],
        contingency: {
          key1: "THIS IS EDITED",
          key2: "WOWWWW",
          key3: "CRAZY",
          key4: "A new key was added too!!!",
        },
      });
      await portfolio.save();
      id = portfolio._id;
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
      id = "1-";

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

      const portfolioInDb = await Portfolio.findById(id);

      expect(portfolioInDb).toBeNull();
    });

    it("should return the removed portfolio", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", portfolio.slug);
      expect(res.body).toHaveProperty("title", portfolio.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === portfolio.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === portfolio.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", portfolio.description);
      expect(res.body).toHaveProperty("image", portfolio.image);
      expect(res.body).toHaveProperty("body", portfolio.body);
      expect(res.body).toHaveProperty("tags");
      expect(res.body).toHaveProperty("contingency");
      expect(res.body).toHaveProperty("addressableHighlights");
    });
  });
});
