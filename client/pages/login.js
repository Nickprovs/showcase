import Joi from "@hapi/joi";
import Form from "../components/common/form";
import Layout from "../components/layout";
import { loginAsync } from "../services/authService";

class LoginForm extends Form {
  constructor() {
    super();

    this.state.data = { username: "", password: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    username: Joi.string()
      .min(1)
      .required()
      .label("Username"),
    password: Joi.string()
      .min(1)
      .required()
      .label("Password")
  });

  doSubmit = async () => {
    const { username, password } = this.state.data;
    await loginAsync(username, password);
  };

  render() {
    return (
      <Layout>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("username", "NAME")}
            {this.renderTextInput("password", "Password", "", "password")}
            {this.renderButton("LOGIN")}
          </form>
        </div>
      </Layout>
    );
  }
}

export default LoginForm;
