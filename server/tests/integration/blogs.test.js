const request = require("supertest");
const { Blog } = require("../../models/blog");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/blogs", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Blog.deleteMany({});
  });

  describe("GET /", () => {
    it("Should return all the blogs", async () => {
      const blogs = [
        {
          title: "dogs",
          datePosted: moment().toJSON(),
          dateLastModified: moment().toJSON(),
          previewText: "The dogiest of dogs.",
          previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
          body: "aadada"
        },
        {
          title: "cats",
          datePosted: moment().toJSON(),
          dateLastModified: moment().toJSON(),
          previewText: "The catiest of cats.",
          previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
          body: "sfsfsfsfsf"
        }
      ];

      await Blog.collection.insertMany(blogs);
      const res = await request(server).get("/blogs");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.title === "dogs")).toBeTruthy();
      expect(res.body.some(g => g.title === "cats")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a blog if valid id is passed", async () => {
      const blog = new Blog({
        title: "dogs",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        previewText: "The dogiest of dogs.",
        previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada"
      });
      await blog.save();

      const res = await request(server).get("/blogs/" + blog._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", blog.title);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/blogs/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no blog with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/blogs/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let blog;
    let token;

    const exec = () => {
      return request(server)
        .post("/blogs")
        .set("x-auth-token", token)
        .send(blog);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();

      blog = {
        title: "testtt",
        previewText: "The dogiest of dogs.",
        previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada"
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      blog.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      blog.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the blog if it is valid", async () => {
      await exec();

      const blog = await Blog.find({ title: "testtt" });

      expect(blog).not.toBeNull();
    });

    it("should return the blog if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", blog.title);
    });
  });
});
