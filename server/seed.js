const { Article } = require("./models/article");
const { ArticleCategory } = require("./models/articleCategory");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const config = require("config");
const moment = require("moment");

const data = [
  {
    categoryName: "Software",
    posts: [
      {
        slug: "is-cloud-the-future",
        title: "Is Cloud The Future?",
        description: "I wonder if cloud is the future...",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        tags: ["cloud", "future", "wonder"]
      },
      {
        slug: "google-docs-is-cool",
        title: "Google Docs is cool",
        description: "I wonder if cloud is the future...",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaggggggggggdada",
        tags: ["google", "docs", "drive", "cool"],
        contingency: {
          dogs: "test"
        }
      }
    ]
  },
  {
    categoryName: "Gaming",
    posts: [
      {
        slug: "the-last-of-us",
        title: "The Last of Us Is Awesome",
        description: "The last of us is so damn cool!",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        tags: ["the", "last", "of", "us", "ps4"]
      },
      {
        slug: "what-will-bungie-do-next",
        title: "What will bungie do next?",
        description: "Halo, Destiny, then...?",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aaggggggggggdada",
        tags: ["halo", "destiny", "bungie"]
      }
    ]
  },
  {
    categoryName: "Fiction",
    posts: [
      {
        slug: "the-hashlinger",
        title: "The Hashlinger",
        description: "The hashlinger's quest for the dark grill...",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "sfsfasfsfsfsfsf",
        tags: ["the", "hash", "slinger", "dark", "grill"]
      },
      {
        slug: "lorem-ipsum",
        title: "Lorem Ipsum",
        description: "What if the lorem became the ipsum?",
        datePosted: moment().toJSON(),
        dateLastModified: moment().toJSON(),
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aagggggfgggggdada",
        tags: ["lorem", "ipsum", "what", "if"]
      }
    ]
  }
];

async function seed() {
  const connection = await mongoose.connect(config.get("db"), { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await connection.connection.db.dropDatabase();
  } catch (ex) {
    console.log(ex);
  }
  // for (let dataItem of data) {
  //   const { _id: categoryId } = await new ArticleCategory({ name: dataItem.categoryName }).save();
  //   const articles = dataItem.posts.map(article => ({
  //     ...article,
  //     category: { _id: categoryId, name: dataItem.categoryName }
  //   }));
  //   await Article.insertMany(articles);
  // }

  mongoose.disconnect();
}

seed();
