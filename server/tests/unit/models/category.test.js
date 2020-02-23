const { schema } = require("../../../models/category");

describe("category.validate", () => {
  it("should validate a properly formed category", () => {
    const category = {
      name: "Software"
    };

    const { error } = schema.validate(category);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed category", () => {
    const category = {
      namdgdg: "Software"
    };

    const { error } = schema.validate(category);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
