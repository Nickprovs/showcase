const { Blog } = require("./models/blog");
const mongoose = require("mongoose");
const config = require("config");
const moment = require("moment");

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
  },
  {
    title: "lizards",
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    previewText: "The lizardiest of cats.",
    previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
    body: "sfsfsfsfsf"
  }
];

async function seed() {
  await mongoose.connect(config.get("db"), { useNewUrlParser: true, useUnifiedTopology: true });

  await Blog.insertMany(blogs);

  mongoose.disconnect();
  console.info("Done!");
}

seed();
