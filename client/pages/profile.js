import Layout from "../components/layout";
import withAuthAsync from "../components/common/withAuthAsync";

const Profile = props => {
  let user = props.user;
  console.log(user);
  return (
    <Layout user={user}>
      <h1 className="mainContentTitle">Profile</h1>
      <p>Username: {user.username}</p>
      <p>Role: {user.isAdmin ? "Administrator" : "Regular"}</p>
    </Layout>
  );
}

export default withAuthAsync(Profile, true);
