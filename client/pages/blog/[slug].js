import Layout from "../../components/layout";
import { getBlogAsync } from "../../services/blogService";
import withAuthAsync from "../../components/common/withAuthAsync";

Blog.getInitialProps = async function(context) {
  const { slug } = context.query;
  const res = await getBlogAsync(slug);
  console.log(res);
  return {
    blog: res
  };
};

function Blog({ blog, user }) {
  return (
    <Layout user={user}>
      <h1>{blog.title}</h1>
      <p>{blog.body}</p>
    </Layout>
  );
}

export default withAuthAsync(Blog);