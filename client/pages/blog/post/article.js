import Layout from "../../../components/layout";
import withAuthAsync from "../../../components/common/withAuthAsync";

const Article = props => {
  let user = props.user;
  return (
    <Layout user={user}>
      <h1 className="mainContentTitle">Post Blog Article</h1>
      <p>
        The standard Lorem Ipsum passage, used since the 1500s "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      </p>
    </Layout>
  );
}

export default withAuthAsync(Article, true);
