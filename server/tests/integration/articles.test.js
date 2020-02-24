const request = require("supertest");
const { Article } = require("../../models/article");
const { ArticleCategory } = require("../../models/articleCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/articles", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Article.deleteMany({});
    await ArticleCategory.deleteMany({});
  });

  describe("GET /", () => {
    it("Should return all the articles", async () => {
      let articleCategory = new ArticleCategory({ name: "Fiction" });
      articleCategory = await articleCategory.save();

      const article1 = new Article({
        slug: "the-great-cow-jumped-over-the-moon",
        title: "The great cow jumped over the moon",
        category: articleCategory,
        description: "The cowiest of cows.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        tags: ["the", "great", "cow"]
      });
      await article1.save();

      const article2 = new Article({
        slug: "the-dog-jumped-over-the-fence",
        title: "The dog jumped over the fence",
        category: articleCategory,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadasfsfsfsfsfsfsfsda",
        tags: ["the", "great", "cow"]
      });
      await article2.save();

      const res = await request(server).get("/articles");
      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.title === "The great cow jumped over the moon")).toBeTruthy();
      expect(res.body.items.some(g => g.title === "The dog jumped over the fence")).toBeTruthy();
      expect(res.body.items.some(g => g.body)).toBeFalsy();
    });
  });

  describe("GET /:id", () => {
    it("should return a article if valid id is passed", async () => {
      let articleCategory = new ArticleCategory({ name: "Fiction" });
      articleCategory = await articleCategory.save();

      const article = new Article({
        slug: "the-great-cow-jumped-over-the-moon",
        title: "The great cow jumped over the moon",
        category: articleCategory,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        addressableHighlight: {
          label: "Cool Search Engine",
          address: "www.google.com"
        },
        tags: ["the", "great", "cow"]
      });
      await article.save();
      const res = await request(server).get("/articles/" + article._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", article.slug);
      expect(res.body).toHaveProperty("title", article.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === article.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === article.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", article.description);
      expect(res.body).toHaveProperty("image", article.image);
      expect(res.body).toHaveProperty("body", article.body);
      expect(res.body).toHaveProperty("addressableHighlight");
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/articles/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no article with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/articles/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let article;
    let token;

    const exec = () => {
      return request(server)
        .post("/articles")
        .set("x-auth-token", token)
        .send(article);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();

      let articleCategory = new ArticleCategory({ name: "Fiction" });
      articleCategory = await articleCategory.save();

      article = {
        slug: "the-dogiest-of-dogs",
        title: "The dogiest of dogs",
        categoryId: articleCategory._id,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        addressableHighlight: {
          label: "Cool Search Engine",
          address: "www.google.com"
        },
        tags: ["The", "Dogiest", "Dog"],
        contingency: {
          key1: "hey",
          key2: "world",
          key3: "what's up"
        }
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      article.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      article.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the article if it is valid", async () => {
      await exec();

      const article = await Article.find({ title: "The dogiest of dogs" });

      expect(article).not.toBeNull();
    });

    it("should return the article if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", article.slug);
      expect(res.body).toHaveProperty("title", article.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", article.description);
      expect(res.body).toHaveProperty("image", article.image);
      expect(res.body).toHaveProperty("body", article.body);
      expect(res.body).toHaveProperty("tags");
      expect(res.body).toHaveProperty("contingency", article.contingency);
      expect(res.body).toHaveProperty("addressableHighlight");
    });
  });

  describe("PUT /", () => {
    let existingArticle;
    let article;
    let token;
    let id;
    let articleCategory;

    const exec = () => {
      return request(server)
        .put("/articles/" + id)
        .set("x-auth-token", token)
        .send(article);
    };

    beforeEach(async () => {
      articleCategory = new ArticleCategory({ name: "Fiction" });
      articleCategory = await articleCategory.save();

      existingArticle = new Article({
        slug: "the-original-dogiest-of-dogs",
        title: "The original dogiest of dogs",
        category: articleCategory,
        description: "The original dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaadeeadada",
        tags: ["The", "Dogiest", "Dog"],
        addressableHighlight: {
          label: "Cool Search Engine",
          address: "www.google.com"
        },
        contingency: {
          key1: "Hi",
          key2: "What's good?",
          key3: "This is wack!"
        }
      });
      await existingArticle.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingArticle._id;
      article = {
        slug: "the-updated-dogiest-of-dogs",
        title: "The updated dogiest of dogs",
        categoryId: articleCategory._id,
        description: "The updated dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaaabbbbbccccddddeeeffffadada",
        tags: ["The", "Dogiest", "Dog"],
        addressableHighlight: {
          label: "Bad Search Engine",
          address: "www.bing.com"
        },
        contingency: {
          key1: "THIS IS EDITED",
          key2: "WOWWWW",
          key3: "CRAZY",
          key4: "A new key was added too!!!"
        }
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

    it("should return 404 if an existing article with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      article.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      article.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the article if it is valid", async () => {
      await exec();

      const article = await Article.find({ title: "testtt1" });

      expect(article).not.toBeNull();
    });

    it("should update the article if input is valid", async () => {
      await exec();

      const updatedArticle = await Article.findById(existingArticle._id);

      expect(updatedArticle.name).toBe(article.name);
      expect(updatedArticle.contingency.get("key4")).toBeTruthy();
    });

    it("should return the updated article if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", article.title);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", article.slug);
      expect(res.body).toHaveProperty("title", article.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingArticle.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingArticle.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("description", article.description);
      expect(res.body).toHaveProperty("image", article.image);
      expect(res.body).toHaveProperty("body", article.body);
      expect(res.body).toHaveProperty("tags", article.tags);
      expect(res.body).toHaveProperty("contingency", article.contingency);
      expect(res.body).toHaveProperty("addressableHighlight", article.addressableHighlight);
      console.log(res.body);
    });
  });

  describe("DELETE /", () => {
    let token;
    let article;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/articles/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      articleCategory = new ArticleCategory({ name: "Fiction" });
      articleCategory = await articleCategory.save();

      article = new Article({
        slug: "the-original-dogiest-of-dogs",
        title: "The original dogiest of dogs",
        category: articleCategory,
        description: "The original dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaadeeadada",
        tags: ["The", "Dogiest", "Dog"],
        addressableHighlight: {
          label: "Bad Search Engine",
          address: "www.bing.com"
        },
        contingency: {
          key1: "THIS IS EDITED",
          key2: "WOWWWW",
          key3: "CRAZY",
          key4: "A new key was added too!!!"
        }
      });
      await article.save();
      id = article._id;
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

      const articleInDb = await Article.findById(id);

      expect(articleInDb).toBeNull();
    });

    it("should return the removed article", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", article.slug);
      expect(res.body).toHaveProperty("title", article.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === article.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === article.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", article.description);
      expect(res.body).toHaveProperty("image", article.image);
      expect(res.body).toHaveProperty("body", article.body);
      expect(res.body).toHaveProperty("tags");
      expect(res.body).toHaveProperty("contingency");
      expect(res.body).toHaveProperty("addressableHighlight");
    });
  });
});
