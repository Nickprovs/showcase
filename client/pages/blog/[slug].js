import { getBlogAsync } from "../../services/blogService";
import withAuthAsync from "../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../components/common/hoc/withLayoutAsync";
import DatePostedPresenter from "../../components/common/date/datePostedPresenter";
import DateModifiedPresenter from "../../components/common/date/dateModifiedPresenter";
import TagsPresenter from "../../components/common/misc/tagPresenter";

Blog.getInitialProps = async function (context) {
  const { slug } = context.query;
  const res = await getBlogAsync(slug);
  const blog = await res.json();
  return {
    blog: blog,
  };
};

function Blog({ blog }) {
  return (
    <div>
      {/* Primary Article Content*/}
      <div>
        <h1>{blog.title}</h1>
        <DatePostedPresenter date={blog.datePosted} />
        <div style={{ marginTop: "25px" }} dangerouslySetInnerHTML={{ __html: blog.body }} />
      </div>

      {/* Secondary Article Content */}
      <div>
        <br />
        {blog.addressableHighlights && blog.addressableHighlights.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {blog.addressableHighlights.map((addressableHighlight) => (
              <a key={addressableHighlight.label} style={{ margin: "10px" }} target="_blank" href={addressableHighlight.address}>
                {addressableHighlight.label}
              </a>
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "15px" }}>
          <TagsPresenter optionalUrl={"/blog"} tags={blog.tags} />
        </div>
        <DateModifiedPresenter postedDate={blog.datePosted} modifiedDate={blog.dateLastModified} />
      </div>
    </div>
  );
}

export default withAuthAsync(withLayoutAsync(Blog));
