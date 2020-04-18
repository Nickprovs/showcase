import Layout from "../../../components/layout";
import { getSoftwareAsync } from "../../../services/softwareService";
import withAuthAsync from "../../../components/common/withAuthAsync";

Software.getInitialProps = async function (context) {
  const { slug } = context.query;
  const res = await getSoftwareAsync(slug);
  const software = await res.json();
  return {
    software: software,
  };
};

function Software({ software, user }) {
  console.log(software.body);
  return (
    <Layout user={user}>
      <h1>{software.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: software.body }} />
    </Layout>
  );
}

export default withAuthAsync(Software);
