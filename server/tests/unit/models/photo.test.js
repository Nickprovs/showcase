const { joiSchema: schema } = require("../../../models/photo");
const mongoose = require("mongoose");

describe("photo.validate", () => {
  it("should validate a properly formed photo", () => {
    const photo = {
      title: "testtt",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      orientation: "portrait",
      displaySize: "medium",
      source: "https://i.imgur.com/O2NQNvP.jpg"
    };

    const { error } = schema.validate(photo);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed photo", () => {
    const photo = {
      title: "testtt",
      description: "The dogiest of dogs.",
      orientation: "dogs",
      displaySize: "medium",
      source: "https://i.imgur.com/O2NQNvP.jpg"
    };

    const { error } = schema.validate(photo);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
