const { joiSchema: schema } = require("../../../models/blogCategory");

describe("blogCategory.validate", () => {
  it("should validate a properly formed articleCategory", () => {
    const articleCategory = {
      name: "Software",
      slug: "software",
    };

    const { error } = schema.validate(articleCategory);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed articleCategory", () => {
    const articleCategory = {
      namdgdg: "Software",
      slug: "sof&*@^tware",
    };

    const { error } = schema.validate(articleCategory);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
