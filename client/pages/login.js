import { Component } from "react";
import Router from "next/router";
import withAuthAsync from "../components/common/withAuthAsync";
import withLayoutAsync from "../components/common/withLayoutAsync";
import LoginCredentialsForm from "../components/loginCredentialsForm";
import LoginEmailMfaForm from "../components/loginEmailMfaForm";

class Login extends Component {
  constructor() {
    super();
    this.state = { showEmailCodeAuth: false };
  }

  async handleCredentialsAuthCompletedAsync(result) {
    if (result.authComplete) Router.push("/");
    else this.setState({ showEmailCodeAuth: true });
  }

  async handleEmailMfaAuthCompletedAsync(result) {
    Router.push("/");
  }

  render() {
    const { showEmailCodeAuth } = this.state;
    return showEmailCodeAuth ? (
      <LoginEmailMfaForm onEmailMfaAuthCompleteAsync={async (result) => await this.handleEmailMfaAuthCompletedAsync(result)} />
    ) : (
      <LoginCredentialsForm onCredentialsAuthCompletedAsync={async (result) => await this.handleCredentialsAuthCompletedAsync(result)} />
    );
  }
}

export default withAuthAsync(withLayoutAsync(Login));
