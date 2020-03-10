import Joi from "@hapi/joi";
import Form from "./common/form";

class TestForm extends Form {
  constructor() {
    super();

    this.state.data = { name: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(30)
      .required()
      .label("Name"),
    category: Joi.string()
      .min(5)
      .max(30)
      .required()
      .label("category")
  });

  doSubmit = () => {
    console.log("form submission clicked");
  };

  render() {
    return (
      <div className="standardPadding">
        <form onSubmit={this.handleSubmit}>
          {this.renderTextInput("name", "NAME")}
          {/* {this.renderDatalist("category", "CATEGORY", "", ["Option1", "Option2", "Option3", "O"])} */}{" "}
          {/* {this.renderDatalist("category", "CATEGORY", "", ["Option1", "Option2", "Option3", "O"])} */}
          {this.renderSelect("category", "CATEGORY", "", ["Option1", "Option2", "Option3", "O"])}
        </form>
      </div>
    );
  }
}

export default TestForm;
