import withAuthAsync from "../components/common/withAuthAsync";
import withLayoutAsync from "../components/common/withLayoutAsync";

function Error({ statusCode }) {
  return (
    <div>
      <h1 className="mainContentTitle">{statusCode ? `${statusCode} Error` : "Error"}</h1>
      <p>{statusCode ? `An error occurred on the server.` : "An error occurred on client."}</p>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="director_sad.svg"></object>
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
