import withAuthAsync from "../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../components/common/hoc/withLayoutAsync";
import Head from "next/head";
import FormatUtilities from "../util/formatUtilities";
import { I1_DIRECTOR_SAD } from "../misc/iconData";

function Error({ statusCode, general }) {
  return (
    <div>
      <Head>
        <title>{FormatUtilities.getFormattedWebsiteTitle("Error", general ? general.title : "Showcase")}</title>
        <meta name="description" content="Oops. Something went wrong!" />
        <meta name="robots" content="noindex" />
      </Head>
      <h1 className="mainContentTitle">{statusCode ? `${statusCode} Error` : "Error"}</h1>
      <p>{statusCode ? `An error occurred on the server.` : "An error occurred on client."}</p>
      <div style={{ textAlign: "center" }}>
        <div className="svg-container-medium" style={{ marginBottom: "25px" }}>
          <svg version="1.1" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet" className="svg-content">
            <path fill="none" stroke="var(--f1)" strokeWidth="2" d={I1_DIRECTOR_SAD} />
          </svg>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default withAuthAsync(withLayoutAsync(Error));
