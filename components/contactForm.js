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
      <div style={{ marginLeft: "10px", marginRight: "10px" }}>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("email", "Email")}
          {this.renderInput("message", "Message")}
          {this.renderRecaptcha()}
          {this.renderButton("Send Message")}
        </form>
      </div>
    );
  }
}

export default ContactForm;
