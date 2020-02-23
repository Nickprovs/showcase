const { schema } = require("../../../models/article");

describe("article.validate", () => {
  it("should validate a properly formed article", () => {
    const article = {
      slug: "dogUri",
      title: "testtt",
      description: "The dogiest of dogs.",
      image: "https://i.imgur.com/O2NQNvP.jpg",
      body: "aadada"
    };

    const { error } = schema.validate(article);
    const isValid = !error;

    expect(isValid).toBe(true);
  });
});
