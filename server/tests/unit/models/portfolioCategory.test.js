const { joiSchema: schema } = require("../../../models/portfolioCategory");

describe("portfolioCategory.validate", () => {
  it("should validate a properly formed portfolioCategory", () => {
    const portfolioCategory = {
      name: "Portfolio",
      slug: "portfolio",
    };

    const { error } = schema.validate(portfolioCategory);
    const isValid = !error;

    expect(isValid).toBe(true);
  });

  it("should validate an improperly formed portfolioCategory", () => {
    const portfolioCategory = {
      namdgdg: "Portfolio",
      slug: "sof$^&@tware",
    };

    const { error } = schema.validate(portfolioCategory);
    const isValid = !error;

    expect(isValid).toBe(false);
  });
});
