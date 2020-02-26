const request = require("supertest");
const { Software } = require("../../models/software");
const { SoftwareCategory } = require("../../models/softwareCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/software", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Software.deleteMany({});
    await SoftwareCategory.deleteMany({});
  });

  describe("GET /", () => {
    it("Should return all the software projects", async () => {
      let softwareCategory = new SoftwareCategory({ name: "Fiction" });
      softwareCategory = await softwareCategory.save();

      const software1 = new Software({
        slug: "the-great-cow-jumped-over-the-moon",
        title: "The great cow jumped over the moon",
        category: softwareCategory,
        description: "The cowiest of cows.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        tags: ["the", "great", "cow"]
      });
      await software1.save();

      const software2 = new Software({
        slug: "the-dog-jumped-over-the-fence",
        title: "The dog jumped over the fence",
        category: softwareCategory,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadasfsfsfsfsfsfsfsda",
        tags: ["the", "great", "cow"]
      });
      await software2.save();

      const res = await request(server).get("/software");
      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.title === "The great cow jumped over the moon")).toBeTruthy();
      expect(res.body.items.some(g => g.title === "The dog jumped over the fence")).toBeTruthy();
      expect(res.body.items.some(g => g.body)).toBeFalsy();
    });
  });

  describe("GET /:id", () => {
    it("should return a software if valid id is passed", async () => {
      let softwareCategory = new SoftwareCategory({ name: "Fiction" });
      softwareCategory = await softwareCategory.save();

      const software = new Software({
        slug: "the-great-cow-jumped-over-the-moon",
        title: "The great cow jumped over the moon",
        category: softwareCategory,
        description: "The dogiest of dogs.",
        image: "https://i.imgur.com/O2NQNvP.jpg",
        body: "aadada",
        addressableHighlight: {
          label: "Cool Search Engine",
          address: "www.google.com"
        },
        tags: ["the", "great", "cow"]
      });
      await software.save();
      const res = await request(server).get("/software/" + software._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", software.slug);
      expect(res.body).toHaveProperty("title", software.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === software.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === software.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", software.description);
      expect(res.body).toHaveProperty("image", software.image);
      expect(res.body).toHaveProperty("body", software.body);
      expect(res.body).toHaveProperty("addressableHighlight");
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/software/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no software with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/software/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let software;
    let token;

    const exec = () => {
      return request(server)
        .post("/software")
        .set("x-auth-token", token)
        .send(software);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();

      let softwareCategory = new SoftwareCategory({ name: "Fiction" });
      softwareCategory = await softwareCategory.save();

      software = {
        slug: "the-dogiest-of-dogs",
        title: "The dogiest of dogs",
        categoryId: softwareCategory._id,
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
      software.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      software.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the software if it is valid", async () => {
      await exec();

      const software = await Software.find({ title: "The dogiest of dogs" });

      expect(software).not.toBeNull();
    });

    it("should return the software if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", software.slug);
      expect(res.body).toHaveProperty("title", software.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", software.description);
      expect(res.body).toHaveProperty("image", software.image);
      expect(res.body).toHaveProperty("body", software.body);
      expect(res.body).toHaveProperty("tags");
      expect(res.body).toHaveProperty("contingency", software.contingency);
      expect(res.body).toHaveProperty("addressableHighlight");
    });
  });

  describe("PUT /", () => {
    let existingSoftware;
    let software;
    let token;
    let id;
    let softwareCategory;

    const exec = () => {
      return request(server)
        .put("/software/" + id)
        .set("x-auth-token", token)
        .send(software);
    };

    beforeEach(async () => {
      softwareCategory = new SoftwareCategory({ name: "Fiction" });
      softwareCategory = await softwareCategory.save();

      existingSoftware = new Software({
        slug: "the-original-dogiest-of-dogs",
        title: "The original dogiest of dogs",
        category: softwareCategory,
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
      await existingSoftware.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingSoftware._id;
      software = {
        slug: "the-updated-dogiest-of-dogs",
        title: "The updated dogiest of dogs",
        categoryId: softwareCategory._id,
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

    it("should return 404 if an existing software with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      software.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      software.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the software if it is valid", async () => {
      await exec();

      const software = await Software.find({ title: "testtt1" });

      expect(software).not.toBeNull();
    });

    it("should update the software if input is valid", async () => {
      await exec();

      const updatedSoftware = await Software.findById(existingSoftware._id);

      expect(updatedSoftware.name).toBe(software.name);
      expect(updatedSoftware.contingency.get("key4")).toBeTruthy();
    });

    it("should return the updated software if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", software.title);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", software.slug);
      expect(res.body).toHaveProperty("title", software.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingSoftware.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingSoftware.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("description", software.description);
      expect(res.body).toHaveProperty("image", software.image);
      expect(res.body).toHaveProperty("body", software.body);
      expect(res.body).toHaveProperty("tags", software.tags);
      expect(res.body).toHaveProperty("contingency", software.contingency);
      expect(res.body).toHaveProperty("addressableHighlight", software.addressableHighlight);
      console.log(res.body);
    });
  });

  describe("DELETE /", () => {
    let token;
    let software;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/software/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      softwareCategory = new SoftwareCategory({ name: "Fiction" });
      softwareCategory = await softwareCategory.save();

      software = new Software({
        slug: "the-original-dogiest-of-dogs",
        title: "The original dogiest of dogs",
        category: softwareCategory,
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
      await software.save();
      id = software._id;
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

    it("should return 404 if no software with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the software if input is valid", async () => {
      await exec();

      const softwareInDb = await Software.findById(id);

      expect(softwareInDb).toBeNull();
    });

    it("should return the removed software", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("slug", software.slug);
      expect(res.body).toHaveProperty("title", software.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === software.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === software.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", software.description);
      expect(res.body).toHaveProperty("image", software.image);
      expect(res.body).toHaveProperty("body", software.body);
      expect(res.body).toHaveProperty("tags");
      expect(res.body).toHaveProperty("contingency");
      expect(res.body).toHaveProperty("addressableHighlight");
    });
  });
});