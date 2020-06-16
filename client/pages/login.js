import { Component } from "react";
import Router from "next/router";
import withAuthAsync from "../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../components/common/hoc/withLayoutAsync";
import LoginCredentialsForm from "../components/page/login/loginCredentialsForm";
import LoginEmailMfaForm from "../components/page/login/loginEmailMfaForm";
import { parseCookies, setCookie } from "nookies";
import Head from "next/head";
import FormatUtilities from "../util/formatUtilities";
import StringUtilities from "../util/stringUtilities";

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
    const { general } = this.props;

    return (
      <div>
        <Head>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Login", general ? general.title : "Showcase")}</title>
          <meta name="description" content={`Login to the ${StringUtilities.toEachWordCapitalized(general.title)} site.`} />
        </Head>
        {showEmailCodeAuth ? (
          <LoginEmailMfaForm onEmailMfaAuthCompleteAsync={async (result) => await this.handleEmailMfaAuthCompletedAsync(result)} />
        ) : (
          <LoginCredentialsForm onCredentialsAuthCompletedAsync={async (result) => await this.handleCredentialsAuthCompletedAsync(result)} />
        )}
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Login));
