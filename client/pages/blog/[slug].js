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
      <h1>{blog.title}</h1>
      <DatePostedPresenter withLines={false} date={blog.datePosted} />
      <div dangerouslySetInnerHTML={{ __html: blog.body }} />

      {/* Article Footer Stuff */}
      <div>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TagsPresenter optionalUrl={"/blog"} tags={blog.tags} />
        </div>
        <DateModifiedPresenter postedDate={blog.datePosted} modifiedDate={blog.dateLastModified} />
      </div>
    </div>
  );
}

export default withAuthAsync(withLayoutAsync(Blog));
