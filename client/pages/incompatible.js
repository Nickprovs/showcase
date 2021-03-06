import Head from "next/head";
import FormatUtilities from "../util/formatUtilities";

export default function Incompatible(props) {
  const { general } = props;

  return (
    <div>
      <Head>
        <title>{FormatUtilities.getFormattedWebsiteTitle("Incompatible", general ? general.title : "Showcase")}</title>
        <meta name="description" content="Oops. There seems to be an incompatibility issue!" />
        <meta name="robots" content="noindex" />
      </Head>
      <h1>This browser isn't compatible.</h1>
      <h2>Sorry about that.</h2>
      {/*We use the object approach to svg here as inline-svg most likely won't work well with incompatible browsers*/}
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/images/director_sad.svg"></object>
        </div>
      </div>
    </div>
  );
}
