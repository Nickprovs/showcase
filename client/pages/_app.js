import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Router from "next/router";
// This default export is required in a new `pages/_app.js` file.

export default function MyApp({ Component, pageProps }) {
  //Routing done with Router.push doesn't scroll to top. This is a fix for that.
  Router.events.on("routeChangeComplete", () => {
    window.scrollTo(0, 0);
  });

  if (RegExp.prototype.flags === undefined) {
    Object.defineProperty(RegExp.prototype, "flags", {
      configurable: true,
      get: function() {
        return this.toString().match(/[gimsuy]*$/)[0];
      }
    });
  }

  return <Component {...pageProps} />;
}
