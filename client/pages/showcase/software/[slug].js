import { getSoftwareAsync } from "../../../services/softwareService";
import withAuthAsync from "../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../components/common/hoc/withLayoutAsync";
import DatePostedPresenter from "../../../components/common/datePostedPresenter";
import DateModifiedPresenter from "../../../components/common/dateModifiedPresenter";
import TagsPresenter from "../../../components/common/misc/tagPresenter";

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
      <DatePostedPresenter withLines={false} date={software.datePosted} />
      <div dangerouslySetInnerHTML={{ __html: software.body }} />

      {/* Article Footer Stuff */}
      <div>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TagsPresenter optionalUrl={"/showcase/software"} tags={software.tags} />
        </div>
        <DateModifiedPresenter postedDate={software.datePosted} modifiedDate={software.dateLastModified} />
      </div>
    </div>
  );
}

export default withAuthAsync(withLayoutAsync(Software));
