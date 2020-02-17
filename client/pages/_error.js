import Layout from "../components/layout";

function Error({ statusCode }) {
  return (
    <Layout>
      <h1 className="mainContentTitle">{statusCode ? `${statusCode} Error` : "Error"}</h1>
      <p>{statusCode ? `An error occurred on the server.` : "An error occurred on client."}</p>
      <img className="centerImage" src="/sad.png"></img>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
