const { Blog } = require("./models/blog");
const { BlogCategory } = require("./models/blogCategory");
const request = require("supertest");
const config = require("config");

async function debug() {
    const server = require("./index");

    try{
        console.log("seeding data");

        await Blog.deleteMany({});
        await BlogCategory.deleteMany({});

        articleCategory1 = new BlogCategory({ name: "Fiction", slug: "fiction" });
        articleCategory1 = await articleCategory1.save();

        articleCategory2 = new BlogCategory({ name: "Non-Fiction", slug: "non-fiction" });
        articleCategory2 = await articleCategory2.save();

        article1 = new Blog({
        slug: "the-great-cow-jumped-over-the-moon",
        title: "The great cow jumped over the moon",
        category: articleCategory1,
        description: "The cowiest of cows.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        tags: ["the", "great", "cow", "common1", "common2"],
        });
        await article1.save();

        article2 = new Blog({
        slug: "the-dog-jumped-over-the-fence",
        title: "The dog jumped over the fence",
        category: articleCategory2,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadasfsfsfsfsfsfsfsda",
        tags: ["the", "great", "cow", "common1", "common2"],
        });
        await article2.save();

        article3 = new Blog({
        slug: "the-beaver-jumped-over-the-fence",
        title: "The beaver jumped over the fence",
        category: articleCategory2,
        description: "The beaveriest of beavers.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadasfsfsfsfsfsfsfsda",
        tags: ["the", "beaver", "beav"],
        });
        await article3.save();
        console.log("data processed");
    }
    catch(ex) {
        console.error("error seeding data");
        console.error(ex);
    }

    try{
        console.log("testing call to GET blogs");
        console.log("served at path" + config.get("servedAtPath"));

        const res = await request(server).get("/blogs");
        const success = res.status === 200 && res.body.items.length === 3;
        if(success)
            console.log("GET blogs works fine");
        else
            console.error("GET blogs does not work fine");
    }
    catch(ex) {
        console.error("error testing GET blogs");
        console.error(ex);
    }

    try{
        console.log("cleaning up");

        await server.close();
        await Blog.deleteMany({});
        await BlogCategory.deleteMany({});
        console.log("clean up successful");
    }
    catch(ex) {
        console.error("error cleaning up data");
        console.error(ex);
    }
}

debug();
