import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import withAuthAsync from "../../../components/common/withAuthAsync";

function Post(props) {
  let {user} = props;
  const router = useRouter();
  return (
    <Layout user={user}>
      <h1>{router.query.id}</h1>
      <h1>{router.query.page}</h1>
      <p>This is the blog post content.</p>
    </Layout>
  );
}
export default withAuthAsync(Post);
