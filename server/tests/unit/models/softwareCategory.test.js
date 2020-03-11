const { joiSchema: schema } = require("../../../models/softwareCategory");

describe("softwareCategory.validate", () => {
  it("should validate a properly formed softwareCategory", () => {
    const softwareCategory = {
      name: "Software",
      slug: "software"
    };

    const { error } = schema.validate(softwareCategory);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed softwareCategory", () => {
    const softwareCategory = {
      namdgdg: "Software",
      slug: "sof$^&@tware"
    };

    const { error } = schema.validate(softwareCategory);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
