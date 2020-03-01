import { useRouter } from "next/router";
import Layout from "../../components/layout";

export default function Blog() {
  const router = useRouter();
  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <h1>{router.query.page}</h1>
      <p>This is the blog post content.</p>
    </Layout>
  );
}

Blog.getInitialProps = async function(context) {
  const getOptions = {
    offset: (currentPage - 1) * pageSize,
    limit: pageSize
  };

  const res = await getBlogPreviewsAsync(getOptions);

  return {
    previews: res.items,
    currentPage: currentPage,
    totalBlogsCount: res.total
  };
};
