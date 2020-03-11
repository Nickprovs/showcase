const { joiSchema: schema } = require("../../../models/videoCategory");

describe("videoCategory.validate", () => {
  it("should validate a properly formed videoCategory", () => {
    const videoCategory = {
      name: "Software",
      slug: "software"
    };

    const { error } = schema.validate(videoCategory);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed videoCategory", () => {
    const videoCategory = {
      namdgdg: "Software",
      slug: "#*@$software"
    };

    const { error } = schema.validate(videoCategory);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
