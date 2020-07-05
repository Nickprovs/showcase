import { getSoftwareAsync } from "../../../services/softwareService";
import withAuthAsync from "../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../components/common/hoc/withLayoutAsync";
import DatePostedPresenter from "../../../components/common/date/datePostedPresenter";
import DateModifiedPresenter from "../../../components/common/date/dateModifiedPresenter";
import TagsPresenter from "../../../components/common/misc/tagPresenter";
import Head from "next/head";
import FormatUtilities from "../../../util/formatUtilities";
import { useEffect } from "react";
import reframe from "reframe.js";
import DangerouslySetInnerHtmlWithScript from "../../../components/common/misc/dangerouslySetInnerHtmlWithScript";
import { sanitize } from "isomorphic-dompurify";
import initializeDomPurify from "../../../misc/customDomPurify";

Software.getInitialProps = async function (context) {
  const { slug } = context.query;
  const res = await getSoftwareAsync(slug);
  const software = await res.json();
  return {
    software: software,
  };
};

function Software({ software, general }) {
  useEffect(() => {
    initializeDomPurify();
    setTimeout(() => reframe("iframe"), 0);
  });

  return (
    <article>
      <Head>
        <title>{FormatUtilities.getFormattedWebsiteTitle(software.title, general ? general.title : "Showcase")}</title>
        <meta name="description" content={software.description} />
        <meta property="og:title" content={software.title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={software.image} />
        <meta property="og:description" content={software.description} />
        <meta property="og:article:published_time" content={software.datePosted} />
        <meta property="og:article:modified_time" content={software.dateLastModified} />
        <meta property="og:article:tag" content={software.tags} />
        <meta property="og:article:section" content={software.category.name} />
        <meta property="og:article:author" content={general ? general.title : "Admin"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {/* Primary Article Content*/}
      <div>
        <h1>{software.title}</h1>
        <DatePostedPresenter date={software.datePosted} />
        <DangerouslySetInnerHtmlWithScript style={{ marginTop: "25px" }} html={sanitize(software.body)} />
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
    </article>
  );
}

export default withAuthAsync(withLayoutAsync(Software));
