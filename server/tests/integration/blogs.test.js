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
          uri: "dogsUri",
          title: "dogs",
          datePosted: moment().toJSON(),
          dateLastModified: moment().toJSON(),
          previewText: "The dogiest of dogs.",
          previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
          body: "aadada"
        },
        {
          uri: "catsUri",
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
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.title === "dogs")).toBeTruthy();
      expect(res.body.items.some(g => g.title === "cats")).toBeTruthy();
      expect(res.body.items.some(g => g.body)).toBeFalsy();
    });
  });

  describe("GET /:id", () => {
    it("should return a blog if valid id is passed", async () => {
      const blog = new Blog({
        uri: "dogsUri",
        title: "dogs",
        previewText: "The dogiest of dogs.",
        previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada"
      });
      await blog.save();
      const res = await request(server).get("/blogs/" + blog._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("uri", blog.uri);
      expect(res.body).toHaveProperty("title", blog.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === blog.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === blog.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("previewText", blog.previewText);
      expect(res.body).toHaveProperty("previewImageSource", blog.previewImageSource);
      expect(res.body).toHaveProperty("body", blog.body);
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/blogs/1");
      expect(res.status).toBe(400);
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
        uri: "dogsUri",
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
      expect(res.body).toHaveProperty("uri", blog.uri);
      expect(res.body).toHaveProperty("title", blog.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("previewText", blog.previewText);
      expect(res.body).toHaveProperty("previewImageSource", blog.previewImageSource);
      expect(res.body).toHaveProperty("body", blog.body);
    });
  });

  describe("PUT /", () => {
    let existingBlog;
    let blog;
    let token;
    let id;

    const exec = () => {
      return request(server)
        .put("/blogs/" + id)
        .set("x-auth-token", token)
        .send(blog);
    };

    beforeEach(async () => {
      existingBlog = new Blog({
        uri: "dogsUri",
        title: "dogs",
        previewText: "The dogiest of dogs.",
        previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada"
      });

      await existingBlog.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingBlog._id;
      blog = {
        uri: "dogsUri",
        title: "testtt1",
        previewText: "The dogiest of dogs1.",
        previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada1"
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

    it("should return 404 if an existing blog with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
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

      const blog = await Blog.find({ title: "testtt1" });

      expect(blog).not.toBeNull();
    });

    it("should update the blog if input is valid", async () => {
      await exec();

      const updatedBlog = await Blog.findById(existingBlog._id);

      expect(updatedBlog.name).toBe(blog.name);
    });

    it("should return the updated blog if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", blog.title);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("uri", blog.uri);
      expect(res.body).toHaveProperty("title", blog.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingBlog.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingBlog.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("previewText", blog.previewText);
      expect(res.body).toHaveProperty("previewImageSource", blog.previewImageSource);
      expect(res.body).toHaveProperty("body", blog.body);
    });
  });

  describe("DELETE /", () => {
    let token;
    let blog;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/blogs/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a blog and
      // put it in the database.
      blog = new Blog({
        uri: "dogsUri",
        title: "To Delete Dog",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        previewText: "The dogiest of dogs.",
        previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada"
      });
      await blog.save();
      id = blog._id;
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

    it("should return 404 if no blog with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the blog if input is valid", async () => {
      await exec();

      const blogInDb = await Blog.findById(id);

      expect(blogInDb).toBeNull();
    });

    it("should return the removed blog", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("uri", blog.uri);
      expect(res.body).toHaveProperty("title", blog.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("previewText", blog.previewText);
      expect(res.body).toHaveProperty("previewImageSource", blog.previewImageSource);
      expect(res.body).toHaveProperty("body", blog.body);
    });
  });
});
