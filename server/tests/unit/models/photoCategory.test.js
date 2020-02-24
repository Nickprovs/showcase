const { joiSchema: schema } = require("../../../models/photoCategory");

describe("photoCategory.validate", () => {
  it("should validate a properly formed photoCategory", () => {
    const photoCategory = {
      name: "Software"
    };

    const { error } = schema.validate(photoCategory);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed photoCategory", () => {
    const photoCategory = {
      namdgdg: "Software"
    };

    const { error } = schema.validate(photoCategory);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
