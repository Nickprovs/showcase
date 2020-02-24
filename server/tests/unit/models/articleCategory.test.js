const { joiSchema: schema } = require("../../../models/articleCategory");

describe("articleCategory.validate", () => {
  it("should validate a properly formed articleCategory", () => {
    const articleCategory = {
      name: "Software"
    };

    const { error } = schema.validate(articleCategory);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed articleCategory", () => {
    const articleCategory = {
      namdgdg: "Software"
    };

    const { error } = schema.validate(articleCategory);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
