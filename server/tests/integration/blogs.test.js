const request = require("supertest");
const { Blog } = require("../../models/blog");
const mongoose = require("mongoose");
const moment = require("moment");

describe("/blogs", () => {
  let server;
  let blog;

  const exec = () => {
    return request(server)
      .post("/blogs")
      .send({ blog });
  };

  beforeEach(async () => {
    server = require("../../index");

    blogId = mongoose.Types.ObjectId();

    blog = new Blog({
      title: "testtt",
      datePosted: moment().toJSON(),
      dateLastModified: moment().toJSON(),
      previewText: "The dogiest of dogs.",
      previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada"
    });
    await blog.save();
  });

  afterEach(async () => {
    await server.close();
    await Blog.remove({});
  });

  it("should return 200 if successful", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
