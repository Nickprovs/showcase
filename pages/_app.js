import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  console.log("hi");
  return <Component {...pageProps} />;
}
