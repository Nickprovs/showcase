import Layout from "../../components/layout";
import { getBlogAsync } from "../../services/blogService";
import withAuthAsync from "../../components/common/withAuthAsync";

Blog.getInitialProps = async function(context) {
  const { slug } = context.query;
  const res = await getBlogAsync(slug);
  const blog = await res.json();
  return {
    blog: blog
  };
};

function Blog({ blog, user }) {
  console.log(blog.body);
  return (
    <Layout user={user}>
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{__html: blog.body}}/>
    </Layout>
  );
}

export default withAuthAsync(Blog);