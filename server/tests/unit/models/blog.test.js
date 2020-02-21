const { schema } = require("../../../models/blog");

describe("blog.validate", () => {
  it("should validate a properly formed blog", () => {
    const blog = {
      uri: "dogUri",
      title: "testtt",
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada"
    };

    const { error } = schema.validate(blog);
    const isValid = !error;

    expect(isValid).toBe(true);
  });
});
