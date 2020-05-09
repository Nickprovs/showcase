import Layout from "../components/layout";
import withAuthAsync from "../components/common/withAuthAsync";
import { Component } from "react";
import { getFeaturedAsync } from "../services/featuredService";

class Index extends Component {
  static async getInitialProps(context) {
    const featuredRes = await getFeaturedAsync();
    const featured = await featuredRes.json();

    return {
      featured: featured,
    };
  }

  render() {
    let { user, featured } = this.props;
    return (
      <Layout user={user}>
        <div dangerouslySetInnerHTML={{ __html: featured.body }} />
      </Layout>
    );
  }
}

export default withAuthAsync(Index);
