const { joiSchema: schema } = require("../../../models/article");
const mongoose = require("mongoose");

describe("article.validate", () => {
  it("should validate a properly formed article", () => {
    const article = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      tags: ["The", "Dogs", "Have", "Eyes"]
    };

    const { error } = schema.validate(article);
    console.log(error);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed article (not enough tags)", () => {
    const article = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      tags: ["the", "dogs"]
    };

    const { error } = schema.validate(article);
    console.log(error);
    const isValid = !error;

    expect(isValid).toBe(false);
  });

  it("should validate a properly formed article with contingency data", () => {
    const article = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      tags: ["The", "Dogs", "Have", "Eyes"],
      contingency: {
        key1: "hello",
        key2: "world",
        key3: "what is up"
      }
    };

    const { error } = schema.validate(article);
    console.log(error);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed article with invalid contingency data (non string val)", () => {
    const article = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      tags: ["The", "Dogs", "Have", "Eyes"],
      contingency: {
        key1: "hello",
        key2: "world",
        key3: "what is up",
        key3: 1
      }
    };

    const { error } = schema.validate(article);
    console.log(error);
    const isValid = !error;

    expect(isValid).toBe(false);
  });

  it("should validate a properly formed article with an addressable highlight", () => {
    const article = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      addressableHighlight: {
        label: "Cool Search Engine",
        address: "www.google.com"
      },
      tags: ["The", "Dogs", "Have", "Eyes"],
      contingency: {
        key1: "hello",
        key2: "world",
        key3: "what is up"
      }
    };

    const { error } = schema.validate(article);
    console.log(error);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed article with a bad addressable highlight", () => {
    const article = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      addressableHighlight: {
        aaaaaaffff: "Cool Search Engine",
        address: 1
      },
      tags: ["The", "Dogs", "Have", "Eyes"],
      contingency: {
        key1: "hello",
        key2: "world",
        key3: "what is up"
      }
    };

    const { error } = schema.validate(article);
    console.log(error);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
