import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { getBlogAsync } from "../../services/blogService";

export default function Blog({ blog }) {
  const router = useRouter();
  return (
    <Layout>
      <h1>{blog.title}</h1>
      <p>{blog.body}</p>
    </Layout>
  );
}

Blog.getInitialProps = async function(context) {
  const { slug } = context.query;
  console.log(slug);

  const res = await getBlogAsync(slug);
  console.log(res);
  return {
    blog: res
  };
};
