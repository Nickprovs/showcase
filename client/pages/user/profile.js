import withAuthAsync from "../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../components/common/hoc/withLayoutAsync";
import Head from "next/head";
import FormatUtilities from "../../util/formatUtilities";

const Profile = ({ general, user }) => {
  return (
    <div style={{ paddingBottom: "25px" }}>
      <Head>
        <title>{FormatUtilities.getFormattedWebsiteTitle("User", general ? general.title : "Showcase")}</title>
        <meta name="description" content="The user profile section." />
      </Head>
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
