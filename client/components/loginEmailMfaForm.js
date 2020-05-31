import Joi from "@hapi/joi";
import Form from "./common/form/form";
import { authenticateEmailMfaAsync } from "../services/authService";
import NProgress from "nprogress";
import { toast } from "react-toastify";

class LoginEmailMfaForm extends Form {
  constructor() {
    super();

    this.state.data = { emailCode: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    emailCode: Joi.string().min(1).required().label("Email Code"),
  });

  doSubmit = async () => {
    const { emailCode } = this.state.data;
    const { onEmailMfaAuthCompleteAsync } = this.props;

    let res = null;
    //Try and post the new category
    try {
      NProgress.start();
      res = await authenticateEmailMfaAsync(emailCode);
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
      await onEmailMfaAuthCompleteAsync(deserialized);
    }
  };

  render() {
    return (
      <div>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("emailCode", "EMAIL CODE")}
            {this.renderButton("LOGIN")}
          </form>
        </div>
      </div>
    );
  }
}

export default LoginEmailMfaForm;
