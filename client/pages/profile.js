import Layout from "../components/layout";
import withAuthAsync from "../components/common/withAuthAsync";
import withLayoutAsync from "../components/common/withLayoutAsync";

const Profile = (props) => {
  let user = props.user;
  console.log(user);
  return (
    <div>
      <h1 className="mainContentTitle">Profile</h1>
      <p>Username: {user.username}</p>
      <p>Role: {user.isAdmin ? "Administrator" : "Regular"}</p>
    </div>
  );
};

export default withAuthAsync(withLayoutAsync(Profile), true);
