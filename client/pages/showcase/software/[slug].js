import { getSoftwareAsync } from "../../../services/softwareService";
import withAuthAsync from "../../../components/common/withAuthAsync";
import withLayoutAsync from "../../../components/common/withLayoutAsync";
import DatePresenter from "../../../components/common/datePresenter";

Software.getInitialProps = async function (context) {
  const { slug } = context.query;
  const res = await getSoftwareAsync(slug);
  const software = await res.json();
  return {
    software: software,
  };
};

function Software({ software }) {
  console.log(software.body);
  return (
    <div>
      <h1>{software.title}</h1>
      <DatePresenter date={software.datePosted} />
      <div dangerouslySetInnerHTML={{ __html: software.body }} />
    </div>
  );
}

export default withAuthAsync(withLayoutAsync(Software));
