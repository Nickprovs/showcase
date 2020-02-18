const { Blog, validate } = require("../../../models/blog");

describe("blog.validate", () => {
  it("should validate a properly formed blog", () => {
    const blog = {
      title: "testtt",
      previewText: "The dogiest of dogs.",
      previewImageSource: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada"
    };

    const { error } = validate(blog);
    const isValid = !error;

    expect(isValid).toBe(true);
  });
});
