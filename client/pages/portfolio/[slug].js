import { getPortfolioAsync } from "../../services/portfolioService";
import withAuthAsync from "../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../components/common/hoc/withLayoutAsync";
import DatePostedPresenter from "../../components/common/date/datePostedPresenter";
import DateModifiedPresenter from "../../components/common/date/dateModifiedPresenter";
import TagsPresenter from "../../components/common/misc/tagPresenter";
import Head from "next/head";
import FormatUtilities from "../../util/formatUtilities";
import { useEffect } from "react";
import reframe from "reframe.js";
import DangerouslySetInnerHtmlWithScript from "../../components/common/misc/dangerouslySetInnerHtmlWithScript";
import { sanitize } from "isomorphic-dompurify";
import initializeDomPurify from "../../misc/customDomPurify";

Portfolio.getInitialProps = async function (context) {
  const { slug } = context.query;
  const res = await getPortfolioAsync(slug);
  const portfolio = await res.json();
  return {
    portfolio: portfolio,
  };
};

function Portfolio({ portfolio, general }) {
  useEffect(() => {
    initializeDomPurify();
    setTimeout(() => reframe("iframe"), 0);
  });

  return (
    <article>
      <Head>
        <title>{FormatUtilities.getFormattedWebsiteTitle(portfolio.title, general ? general.title : "Showcase")}</title>
        <meta name="description" content={portfolio.description} />
        <meta property="og:title" content={portfolio.title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={portfolio.image} />
        <meta property="og:description" content={portfolio.description} />
        <meta property="og:article:published_time" content={portfolio.datePosted} />
        <meta property="og:article:modified_time" content={portfolio.dateLastModified} />
        <meta property="og:article:tag" content={portfolio.tags} />
        <meta property="og:article:section" content={portfolio.category.name} />
        <meta property="og:article:author" content={general ? general.title : "Admin"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {/* Primary Article Content*/}
      <div>
        <h1>{portfolio.title}</h1>
        <DatePostedPresenter date={portfolio.datePosted} />
        <DangerouslySetInnerHtmlWithScript style={{ marginTop: "25px" }} html={sanitize(portfolio.body)} />
      </div>

      {/* Secondary Article Content */}
      <div>
        <br />
        {portfolio.addressableHighlights && portfolio.addressableHighlights.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {portfolio.addressableHighlights.map((addressableHighlight) => (
              <a key={addressableHighlight.label} style={{ marginLeft: "10px", marginRight: "10px" }} target="_blank" href={addressableHighlight.address}>
                {addressableHighlight.label}
              </a>
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TagsPresenter optionalUrl={"/showcase/portfolio"} tags={portfolio.tags} />
        </div>
        <DateModifiedPresenter postedDate={portfolio.datePosted} modifiedDate={portfolio.dateLastModified} />
      </div>
    </article>
  );
}

export default withAuthAsync(withLayoutAsync(Portfolio));
