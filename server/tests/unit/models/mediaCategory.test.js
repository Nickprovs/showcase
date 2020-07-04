const { joiSchema: schema } = require("../../../models/mediaCategory");

describe("mediaCategory.validate", () => {
  it("should validate a properly formed mediaCategory", () => {
    const mediaCategory = {
      name: "Software",
      slug: "software",
    };

    const { error } = schema.validate(mediaCategory);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed mediaCategory", () => {
    const mediaCategory = {
      namdgdg: "Software",
      slug: "#*@$software",
    };

    const { error } = schema.validate(mediaCategory);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
