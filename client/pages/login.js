import { Component } from "react";
import Router from "next/router";
import withAuthAsync from "../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../components/common/hoc/withLayoutAsync";
import LoginCredentialsForm from "../components/loginCredentialsForm";
import LoginEmailMfaForm from "../components/loginEmailMfaForm";
import { parseCookies, setCookie } from "nookies";

class Login extends Component {
  constructor() {
    super();
    this.state = { showEmailCodeAuth: false };
  }

  async handleCredentialsAuthCompletedAsync(result) {
    let routeToRedirectTo = this.getRedirectionPath();
    if (result.authComplete) Router.push(routeToRedirectTo);
    else this.setState({ showEmailCodeAuth: true });
  }

  async handleEmailMfaAuthCompletedAsync(result) {
    Router.push(this.getRedirectionPath());
  }

  getRedirectionPath() {
    let cookies = parseCookies();
    let routeToRedirectTo = cookies && cookies.lastAuthRedirectFromPathname ? cookies.lastAuthRedirectFromPathname : "/";
    return routeToRedirectTo;
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
