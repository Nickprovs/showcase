import Joi from "@hapi/joi";
import Form from "../components/common/form";
import { loginAsync } from "../services/authService";
import Router from "next/router";
import withAuthAsync from "../components/common/withAuthAsync";
import withLayoutAsync from "../components/common/withLayoutAsync";

class LoginForm extends Form {
  constructor() {
    super();

    this.state.data = { username: "", password: "" };
    this.state.errors = {};
  }

  schema = Joi.object({
    username: Joi.string().min(1).required().label("Username"),
    password: Joi.string().min(1).required().label("Password"),
  });

  doSubmit = async () => {
    const { username, password } = this.state.data;
    try {
      const res = await loginAsync(username, password);
      if (res.status === 200) Router.push("/");
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    return (
      <div>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("username", "USERNAME")}
            {this.renderTextInput("password", "PASSWORD", "", "password")}
            {this.renderButton("LOGIN")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(LoginForm));
