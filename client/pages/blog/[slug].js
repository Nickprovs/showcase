import { getBlogAsync } from "../../services/blogService";
import withAuthAsync from "../../components/common/withAuthAsync";
import withLayoutAsync from "../../components/common/withLayoutAsync";

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
      <div dangerouslySetInnerHTML={{ __html: blog.body }} />
    </div>
  );
}

export default withAuthAsync(withLayoutAsync(Blog));
