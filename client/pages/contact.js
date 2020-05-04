import Layout from "../components/layout";
import withAuthAsync from "../components/common/withAuthAsync";
import Joi from "@hapi/joi";
import Form from "../components/common/form";
import { contactAsync } from "../services/contactService";
import { toast } from "react-toastify";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const recaptchaSiteKey = publicRuntimeConfig.recaptchaSiteKey;

class Contact extends Form {
  constructor() {
    super();

    this.state.data = { name: "", email: "", message: "", captcha: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    name: Joi.string().min(5).max(30).required().label("Name"),
    email: Joi.string().min(6).max(100).required().label("Email"),
    message: Joi.string().min(6).max(1000).required().label("Message"),
    captcha: Joi.string().required().label("Captcha"),
  });

  doSubmit = async () => {
    let contactData = { ...this.state.data };
    contactData.captcha = "12345";

    let res = null;
    //Try and post the new category
    try {
      res = await contactAsync(contactData);
    } catch (ex) {
      let errorMessage = `Error: ${ex}`;
      console.log(errorMessage);
      toast.error(errorMessage);
      return;
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

    // //TODO: Disallow posting duplicate category at server level.
    // Router.push("/blog");
  };

  render() {
    const { user } = this.props;
    return (
      <Layout user={user}>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("name", "NAME")}
            {this.renderTextInput("email", "EMAIL")}
            {this.renderTextArea("message", "MESSAGE")}
            {this.renderRecaptcha("captcha", "CAPTCHA", recaptchaSiteKey)}
            {this.renderButton("SEND MESSAGE")}
          </form>
        </div>
      </Layout>
    );
  }
}

export default withAuthAsync(Contact, false);
