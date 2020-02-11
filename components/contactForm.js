import Joi from "@hapi/joi";
import Form from "./common/form";

class ContactForm extends Form {
  constructor() {
    super();

    this.state.data = { name: "", email: "", message: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(30)
      .required()
      .label("Name"),
    email: Joi.string()
      .min(6)
      .max(20)
      .required()
      .label("Email"),
    message: Joi.string()
      .min(6)
      .max(1000)
      .required()
      .label("Message")
  });

  doSubmit = () => {
    console.log("form submission clicked");
  };

  render() {
    return (
      <div className="standardPadding">
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "NAME")}
          {this.renderInput("email", "EMAIL")}
          {this.renderTextArea("message", "MESSAGE")}
          {this.renderRecaptcha()}
          {this.renderButton("SEND MESSAGE")}
        </form>
      </div>
    );
  }
}

export default ContactForm;
