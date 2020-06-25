import Joi from "@hapi/joi";
import Form from "../../common/form/form";
import { authenticateCredentialsAsync } from "../../../services/authService";
import getConfig from "next/config";
import NProgress from "nprogress";
import { toast } from "react-toastify";

const { publicRuntimeConfig } = getConfig();
const captchaPublicKey = publicRuntimeConfig.captchaPublicKey;

class LoginCredentialsForm extends Form {
  constructor() {
    super();

    this.state.data = { username: "", password: "", captcha: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    username: Joi.string().min(1).required().label("Username"),
    password: Joi.string().min(1).required().label("Password"),
    captcha: Joi.string().required().label("Captcha"),
  });

  doSubmit = async () => {
    const { username, password, captcha } = this.state.data;
    const { onCredentialsAuthCompletedAsync } = this.props;

    let res = null;
    //Try and post the new category
    try {
      NProgress.start();
      res = await authenticateCredentialsAsync(username, password, captcha);
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
      const deserialized = await res.json();
      await onCredentialsAuthCompletedAsync(deserialized);
    }
  };

  render() {
    const { darkModeOn } = this.props;
    return (
      <div>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("username", "USERNAME")}
            {this.renderTextInput("password", "PASSWORD", "", "password")}
            {this.renderRecaptcha("captcha", "CAPTCHA", captchaPublicKey, darkModeOn)}
            {this.renderButton("LOGIN")}
          </form>
        </div>
      </div>
    );
  }
}

export default LoginCredentialsForm;
