import { getCurrentUserAsync } from "../../services/userService";
import RedirectUtilities from "../../util/redirectUtilities";
import { Component } from "react";

const withAuthAsync = (WrappedComponent, redirect = false, redirectUri = "/login") => {
  return class AuthComponent extends Component {
    static async getInitialProps(ctx) {
      //Authenticate w/ server
      let authIssue = true;
      let user = null;
      try {
        const res = await getCurrentUserAsync(ctx);
        if (res.status === 200) {
          user = await res.json();
          authIssue = false;
        }
      } catch (ex) {
        authIssue = true;
      }

      const innerProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
      if (authIssue) {
        if (redirect) RedirectUtilities.Redirect(ctx, redirectUri);
        return { ...innerProps, user };
      } else {
        return { ...innerProps, user };
      }
    }

    constructor(props) {
      super(props);
      this.syncLogout = this.syncLogout.bind(this);
    }

    syncLogout(event) {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/login");
      }
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withAuthAsync;
