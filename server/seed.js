const { Blog } = require("./models/blog");
const mongoose = require("mongoose");
const config = require("config");
const moment = require("moment");

const blogs = [
  {
    slug: "dogsUri",
    title: "dogs",
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    description: "The dogiest of dogs.",
    image: "https://i.imgur.com/O2NQNvP.jpg",
    body: "aadada"
  },
  {
    slug: "catsUri",
    title: "cats",
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    description: "The catiest of cats.",
    image: "https://i.imgur.com/O2NQNvP.jpg",
    body: "sfsfsfsfsf"
  },
  {
    slug: "lizardsUri",
    title: "lizards",
    datePosted: moment().toJSON(),
    dateLastModified: moment().toJSON(),
    description: "The lizardiest of cats.",
    image: "https://i.imgur.com/O2NQNvP.jpg",
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
