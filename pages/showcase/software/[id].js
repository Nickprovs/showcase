import { useRouter } from "next/router";
import Layout from "../../../components/layout";

export default function Post() {
  const router = useRouter();
  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <h1>{router.query.page}</h1>
      <p>This is the blog post content.</p>
    </Layout>
  );
}
