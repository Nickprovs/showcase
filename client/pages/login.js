import { Component } from "react";
import Joi from "@hapi/joi";
import Form from "../components/common/form";
import { authenticateCredentialsAsync } from "../services/authService";
import Router from "next/router";
import withAuthAsync from "../components/common/withAuthAsync";
import withLayoutAsync from "../components/common/withLayoutAsync";
import getConfig from "next/config";
import NProgress from "nprogress";
import { toast } from "react-toastify";
import LoginCredentialsForm from "../components/loginCredentialsForm";
import LoginEmailMfaForm from "../components/loginEmailMfaForm";

const { publicRuntimeConfig } = getConfig();
const recaptchaSiteKey = publicRuntimeConfig.recaptchaSiteKey;

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
