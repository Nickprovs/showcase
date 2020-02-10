import Joi from "@hapi/joi";
import Form from "./common/form";

class ContactForm extends Form {
  state = {
    data: { name: "", email: "", message: "" },
    errors: {}
  };

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
      <div>
        <h1>Contact</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("email", "Email")}
          {this.renderInput("message", "Message")}
          {this.renderButton("Send Message")}
        </form>
      </div>
    );
  }
}

export default ContactForm;
