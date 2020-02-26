const request = require("supertest");
const { Photo } = require("../../models/photo");
const { PhotoCategory } = require("../../models/photoCategory");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
describe("/photos", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Photo.deleteMany({});
    await PhotoCategory.deleteMany({});
  });

  describe("GET /", () => {
    it("Should return all the photo projects", async () => {
      let photoCategory = new PhotoCategory({ name: "Portraits" });
      photoCategory = await photoCategory.save();

      const photo1 = new Photo({
        title: "Dog Photo",
        category: photoCategory,
        description: "A photo of a dog.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["cute", "dog", "doggo"]
      });
      await photo1.save();

      const photo2 = new Photo({
        title: "Cat Photo",
        category: photoCategory,
        description: "A photo of a cat.",
        orientation: "portrait",
        displaySize: "large",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "cat", "kitten"]
      });
      await photo2.save();

      const res = await request(server).get("/photos");
      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.items.some(g => g.title === photo1.title)).toBeTruthy();
      expect(res.body.items.some(g => g.title === photo2.title)).toBeTruthy();
      expect(res.body.items.some(g => g.body)).toBeFalsy();
    });
  });

  describe("GET /:id", () => {
    it("should return a photo if valid id is passed", async () => {
      let photoCategory = new PhotoCategory({ name: "Portrait" });
      photoCategory = await photoCategory.save();

      const photo = new Photo({
        title: "Dog Photo 1",
        category: photoCategory,
        description: "A photo of a dog 1.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["one", "dog", "doggo"]
      });
      await photo.save();
      const res = await request(server).get("/photos/" + photo._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", photo.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === photo.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === photo.dateLastModified.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("description", photo.description);
      expect(res.body).toHaveProperty("orientation", photo.orientation);
      expect(res.body).toHaveProperty("displaySize", photo.displaySize);
      expect(res.body).toHaveProperty("source", photo.source);
      expect(res.body).toHaveProperty("tags");
    });

    it("should return 400 if invalid id is passed", async () => {
      const res = await request(server).get("/photos/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no photo with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/photos/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let photo;
    let token;

    const exec = () => {
      return request(server)
        .post("/photos")
        .set("x-auth-token", token)
        .send(photo);
    };

    beforeEach(async () => {
      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();

      let photoCategory = new PhotoCategory({ name: "Panorama" });
      photoCategory = await photoCategory.save();

      photo = {
        title: "Dog Photo 2",
        categoryId: photoCategory._id,
        description: "A photo of a dog 2.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/xyPtn4m.jpg",
        tags: ["Two", "dog", "doggo"]
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      photo.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      photo.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the photo if it is valid", async () => {
      await exec();

      const postedAndSavedPhoto = await Photo.find({ title: photo.title });

      expect(postedAndSavedPhoto).not.toBeNull();
    });

    it("should return the photo if it is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", photo.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", photo.description);
      expect(res.body).toHaveProperty("orientation", photo.orientation);
      expect(res.body).toHaveProperty("displaySize", photo.displaySize);
      expect(res.body).toHaveProperty("source", photo.source);
      expect(res.body).toHaveProperty("tags");
    });
  });

  describe("PUT /", () => {
    let existingPhoto;
    let photo;
    let token;
    let id;
    let photoCategory;

    const exec = () => {
      return request(server)
        .put("/photos/" + id)
        .set("x-auth-token", token)
        .send(photo);
    };

    beforeEach(async () => {
      photoCategory = new PhotoCategory({ name: "Fiction" });
      photoCategory = await photoCategory.save();

      existingPhoto = new Photo({
        title: "Bunny Photo",
        category: photoCategory,
        description: "A photo of a bunny.",
        orientation: "portrait",
        displaySize: "small",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["cute", "bunny", "rabbit"]
      });
      await existingPhoto.save();

      token = new User({ username: "adminUser", isAdmin: true }).generateAuthToken();
      id = existingPhoto._id;
      photo = {
        title: "Big Bunny Photo",
        categoryId: photoCategory._id,
        description: "A photo of a big bunny.",
        orientation: "landscape",
        displaySize: "medium",
        source: "https://i.imgur.com/8vr8jT8.jpeg",
        tags: ["cute", "bunny", "rabbit"]
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

    it("should return 404 if an existing photo with the provided id is not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      photo.title = "t";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 64 characters", async () => {
      photo.title = new Array(66).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should save the photo if it is valid", async () => {
      await exec();

      const photo = await Photo.find({ title: "testtt1" });

      expect(photo).not.toBeNull();
    });

    it("should update the photo if input is valid", async () => {
      await exec();

      const updatedPhoto = await Photo.findById(existingPhoto._id);

      expect(updatedPhoto.title).toBe(photo.title);
      expect(updatedPhoto.description).toBe(photo.description);
      expect(updatedPhoto.orientation).toBe(photo.orientation);
      expect(updatedPhoto.displaySize).toBe(photo.displaySize);
    });

    it("should return the updated photo if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", photo.title);
      expect(res.body).toHaveProperty("category");
      expect(res.body).toHaveProperty("datePosted");
      expect(new Date(res.body.datePosted).getTime() === existingPhoto.datePosted.getTime()).toBeTruthy();
      expect(res.body).toHaveProperty("dateLastModified");
      expect(new Date(res.body.dateLastModified).getTime() === existingPhoto.dateLastModified.getTime()).toBeFalsy();
      expect(res.body).toHaveProperty("description", photo.description);
      expect(res.body).toHaveProperty("orientation", photo.orientation);
      expect(res.body).toHaveProperty("displaySize", photo.displaySize);
      expect(res.body).toHaveProperty("source", photo.source);
      expect(res.body).toHaveProperty("tags", photo.tags);
    });
  });

  describe("DELETE /", () => {
    let token;
    let photo;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/photos/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      photoCategory = new PhotoCategory({ name: "Candid" });
      photoCategory = await photoCategory.save();

      photo = new Photo({
        title: "Smol Bunny Photo",
        category: photoCategory,
        description: "A photo of a smol bunny.",
        orientation: "panorama",
        displaySize: "medium",
        source: "https://i.imgur.com/ILv82mN.jpeg",
        tags: ["smol", "bunny", "rabbit"]
      });
      await photo.save();
      id = photo._id;
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

    it("should return 404 if no photo with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the photo if input is valid", async () => {
      await exec();

      const photoInDb = await Photo.findById(id);

      expect(photoInDb).toBeNull();
    });

    it("should return the removed photo", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", photo.title);
      expect(res.body).toHaveProperty("datePosted");
      expect(res.body).toHaveProperty("dateLastModified");
      expect(res.body).toHaveProperty("description", photo.description);
      expect(res.body).toHaveProperty("orientation", photo.orientation);
      expect(res.body).toHaveProperty("displaySize", photo.displaySize);
      expect(res.body).toHaveProperty("source", photo.source);
      expect(res.body).toHaveProperty("tags");
    });
  });
});
