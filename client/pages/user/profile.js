import withAuthAsync from "../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../components/common/hoc/withLayoutAsync";

const Profile = (props) => {
  let user = props.user;
  console.log(user);
  return (
    <div style={{ paddingBottom: "25px" }}>
      <h1>Profile</h1>
      <p>
        <b>Username:</b> {user.username}
      </p>
      <p>
        <b>Role:</b> {user.isAdmin ? "Administrator" : "Regular"}
      </p>
    </div>
  );
};

export default withAuthAsync(withLayoutAsync(Profile), true);
