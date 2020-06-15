import { getSoftwareAsync } from "../../../services/softwareService";
import withAuthAsync from "../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../components/common/hoc/withLayoutAsync";
import DatePostedPresenter from "../../../components/common/date/datePostedPresenter";
import DateModifiedPresenter from "../../../components/common/date/dateModifiedPresenter";
import TagsPresenter from "../../../components/common/misc/tagPresenter";
import Head from "next/head";
import FormatUtilities from "../../../util/formatUtilities";

Software.getInitialProps = async function (context) {
  const { slug } = context.query;
  const res = await getSoftwareAsync(slug);
  const software = await res.json();
  return {
    software: software,
  };
};

function Software({ software, general }) {
  return (
    <div>
      <Head>
        <title>{FormatUtilities.getFormattedWebsiteTitle(software.title, general ? general.title : "Showcase")}</title>
      </Head>
      {/* Primary Article Content*/}
      <div>
        <h1>{software.title}</h1>
        <DatePostedPresenter date={software.datePosted} />
        <div style={{ marginTop: "25px" }} dangerouslySetInnerHTML={{ __html: software.body }} />
      </div>

      {/* Secondary Article Content */}
      <div>
        <br />
        {software.addressableHighlights && software.addressableHighlights.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {software.addressableHighlights.map((addressableHighlight) => (
              <a key={addressableHighlight.label} style={{ marginLeft: "10px", marginRight: "10px" }} target="_blank" href={addressableHighlight.address}>
                {addressableHighlight.label}
              </a>
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TagsPresenter optionalUrl={"/showcase/software"} tags={software.tags} />
        </div>
        <DateModifiedPresenter postedDate={software.datePosted} modifiedDate={software.dateLastModified} />
      </div>
    </div>
  );
}

export default withAuthAsync(withLayoutAsync(Software));
