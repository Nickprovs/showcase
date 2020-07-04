const { joiSchema: schema } = require("../../../models/media");
const mongoose = require("mongoose");

describe("media.validate", () => {
  it("should validate a properly formed media", () => {
    const media = {
      title: "testtt",
      categoryId: mongoose.Types.ObjectId().toHexString(),
      description: "The dogiest of dogs.",
      markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/EwTZ2xpQwpA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
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
    };

    const { error } = schema.validate(media);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
