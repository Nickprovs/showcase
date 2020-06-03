import App from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import BrowserSupportUtilities from "../util/browserSupportUtilities";
import RedirectUtilities from "../util/redirectUtilities";
import "react-toastify/dist/ReactToastify.css";
import "../styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

export default function MyApp({ Component, pageProps }) {
  //Route change events
  Router.events.on("routeChangeStart", (url) => {
    NProgress.start();
  });
  Router.events.on("routeChangeComplete", () => {
    //Routing done with Router.push doesn't scroll to top. This is a fix for that.
    window.scrollTo(0, 0);
    NProgress.done();
  });
  Router.events.on("routeChangeError", () => NProgress.done());

  //A fix for a regex issue I was having with Edge
  if (RegExp.prototype.flags === undefined) {
    Object.defineProperty(RegExp.prototype, "flags", {
      configurable: true,
      get: function () {
        return this.toString().match(/[gimsuy]*$/)[0];
      },
    });
  }

  return (
    <div>
      <Head>
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <ToastContainer />
      <Component {...pageProps} />
    </div>
  );
}

//getInitialProps at the app level blocks auto static optimization
//However, since practically every page of this website requires data from the server -- this is fine.
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  //Check for browser compatability and redirect if necessary
  if (appContext.ctx.pathname !== "/incompatible" && !BrowserSupportUtilities.isBrowserSupported(appContext.ctx))
    RedirectUtilities.Redirect(appContext.ctx, "/incompatible");

  return { ...appProps };
};
