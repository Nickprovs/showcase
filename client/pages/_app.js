import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Router from "next/router";
import NProgress from "nprogress";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// This default export is required in a new `pages/_app.js` file.

export default function MyApp({ Component, pageProps }) {
  Router.events.on("routeChangeStart", (url) => {
    NProgress.start();
  });
  Router.events.on("routeChangeComplete", () => {
    //Routing done with Router.push doesn't scroll to top. This is a fix for that.
    window.scrollTo(0, 0);
    NProgress.done();
  });
  Router.events.on("routeChangeError", () => NProgress.done());

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
