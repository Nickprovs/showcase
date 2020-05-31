import withAuthAsync from "../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../components/common/hoc/withLayoutAsync";
import Joi from "@hapi/joi";
import Form from "../components/common/form/form";
import { contactAsync } from "../services/contactService";
import { toast } from "react-toastify";
import getConfig from "next/config";
import NProgress from "nprogress";

const { publicRuntimeConfig } = getConfig();
const captchaPublicKey = publicRuntimeConfig.captchaPublicKey;

class Contact extends Form {
  constructor() {
    super();

    this.originalFormData = { name: "", email: "", message: "", captcha: "" };

    this.state.contactComplete = false;
    this.state.data = this.originalFormData;
    this.state.errors = {};
  }

  schema = Joi.object({
    name: Joi.string().min(3).max(30).required().label("Name"),
    email: Joi.string().min(5).max(100).required().label("Email"),
    message: Joi.string().min(6).max(1000).required().label("Message"),
    captcha: Joi.string().required().label("Captcha"),
  });

  doSubmit = async () => {
    let contactData = { ...this.state.data };

    let res = null;
    //Try and post the new category
    try {
      NProgress.start();
      res = await contactAsync(contactData);
    } catch (ex) {
      let errorMessage = `Error: ${ex}`;
      console.log(errorMessage);
      toast.error(errorMessage);
      return;
    } finally {
      NProgress.done();
    }

    if (!res.ok) {
      let body = "";
      //TODO: Parse Text OR JSON
      body = await res.text();
      let errorMessage = `Error: ${res.status} - ${body}`;
      console.log(errorMessage);
      toast.error(errorMessage);
      return;
    }

    //Set the contact flow as complete and wipe the data from the form
    this.setState({ contactComplete: true });

    //Wipe the form state in case we want to present the form again at some future point.
    this.setState({ data: this.originalFormData });
    this.resetRecaptcha();
  };

  getContactCompleteMarkup() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>{`Thanks for reaching out! I'll get back to you as soon as possible!`}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/director_happy.svg"></object>
        </div>
      </div>
    );
  }

  getContactNotCompleteMarkup() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderTextInput("name", "NAME")}
        {this.renderTextInput("email", "EMAIL")}
        {this.renderTextArea("message", "MESSAGE")}
        {this.renderRecaptcha("captcha", "CAPTCHA", captchaPublicKey)}
        {this.renderButton("SEND MESSAGE")}
      </form>
    );
  }

  render() {
    const { contactComplete } = this.state;

    return (
      <div>
        <div className="standardPadding">{!contactComplete ? this.getContactNotCompleteMarkup() : this.getContactCompleteMarkup()}</div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Contact), false);
