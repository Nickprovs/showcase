const { joiSchema: schema } = require("../../../models/media");
const mongoose = require("mongoose");

describe("media.validate", () => {
  it("should validate a properly formed media", () => {
    const media = {
      title: "testtt",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      orientation: "portrait",
      displaySize: "medium",
      source: "https://i.imgur.com/O2NQNvP.jpg",
    };

    const { error } = schema.validate(media);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed media", () => {
    const media = {
      title: "testtt",
      description: "The dogiest of dogs.",
      categoryId: "Adadadad",
      orientation: "dogs",
      displaySize: "medium",
      source: "https://i.imgur.com/O2NQNvP.jpg",
    };

    const { error } = schema.validate(media);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
