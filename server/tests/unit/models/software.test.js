const { joiSchema: schema } = require("../../../models/software");
const mongoose = require("mongoose");

describe("software.validate", () => {
  it("should validate a properly formed software", () => {
    const software = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      tags: ["The", "Dogs", "Have", "Eyes"],
    };

    const { error } = schema.validate(software);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed software (not enough tags)", () => {
    const software = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      tags: ["the", "dogs"],
    };

    const { error } = schema.validate(software);
    const isValid = !error;

    expect(isValid).toBe(false);
  });

  it("should validate a properly formed software with contingency data", () => {
    const software = {
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
      },
    };

    const { error } = schema.validate(software);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed software with invalid contingency data (non string val)", () => {
    const software = {
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
        key3: 1,
      },
    };

    const { error } = schema.validate(software);
    const isValid = !error;

    expect(isValid).toBe(false);
  });

  it("should validate a properly formed software with an addressable highlight", () => {
    const software = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      addressableHighlights: [
        {
          label: "Cool Search Engine",
          address: "www.google.com",
        },
      ],
      tags: ["The", "Dogs", "Have", "Eyes"],
      contingency: {
        key1: "hello",
        key2: "world",
        key3: "what is up",
      },
    };

    const { error } = schema.validate(software);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed software with a bad addressable highlight", () => {
    const software = {
      slug: "the-dogs-have-eyes",
      title: "The Dogs Have Eyes",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada",
      addressableHighlight: {
        aaaaaaffff: "Cool Search Engine",
        address: 1,
      },
      tags: ["The", "Dogs", "Have", "Eyes"],
      contingency: {
        key1: "hello",
        key2: "world",
        key3: "what is up",
      },
    };

    const { error } = schema.validate(software);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
