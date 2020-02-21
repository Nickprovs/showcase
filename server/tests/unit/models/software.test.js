const { schema } = require("../../../models/software");

describe("software.validate", () => {
  it("should validate a properly formed software", () => {
    const software = {
      uri: "dogUri",
      title: "testtt",
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada"
    };

    const { error } = schema.validate(software);
    const isValid = !error;

    expect(isValid).toBe(true);
  });
});
