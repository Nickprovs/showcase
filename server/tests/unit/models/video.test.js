const { schema } = require("../../../models/video");
const mongoose = require("mongoose");

describe("video.validate", () => {
  it("should validate a properly formed video", () => {
    const video = {
      title: "testtt",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      orientation: "portrait",
      displaySize: "medium",
      source: "https://i.imgur.com/O2NQNvP.jpg"
    };

    const { error } = schema.validate(video);
    console.log(error);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed video", () => {
    const video = {
      title: "testtt",
      description: "The dogiest of dogs.",
      categoryId: "Adadadad",
      orientation: "dogs",
      displaySize: "medium",
      source: "https://i.imgur.com/O2NQNvP.jpg"
    };

    const { error } = schema.validate(video);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
