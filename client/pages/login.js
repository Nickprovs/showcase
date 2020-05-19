import Joi from "@hapi/joi";
import Form from "../components/common/form";
import { loginAsync } from "../services/authService";
import Router from "next/router";
import withAuthAsync from "../components/common/withAuthAsync";
import withLayoutAsync from "../components/common/withLayoutAsync";
import getConfig from "next/config";
import NProgress from "nprogress";
import { toast } from "react-toastify";

const { publicRuntimeConfig } = getConfig();
const recaptchaSiteKey = publicRuntimeConfig.recaptchaSiteKey;

class LoginForm extends Form {
  constructor() {
    super();

    this.state.data = { username: "", password: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    username: Joi.string().min(1).required().label("Username"),
    password: Joi.string().min(1).required().label("Password"),
    captcha: Joi.string().required().label("Captcha"),
  });

  doSubmit = async () => {
    const { username, password, captcha } = this.state.data;

    console.log(captcha);

    let res = null;
    //Try and post the new category
    try {
      NProgress.start();
      res = await loginAsync(username, password, captcha);
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
    } else {
      Router.push("/");
    }
  };

  render() {
    return (
      <div>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("username", "USERNAME")}
            {this.renderTextInput("password", "PASSWORD", "", "password")}
            {this.renderRecaptcha("captcha", "CAPTCHA", recaptchaSiteKey)}
            {this.renderButton("LOGIN")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(LoginForm));
