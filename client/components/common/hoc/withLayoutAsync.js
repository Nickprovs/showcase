import Layout from "../../layout/layout.js";
import { Component } from "react";
import { getGeneralAsync } from "../../../services/generalService";
const withLayoutAsync = (WrappedComponent) => {
  return class LayoutWrapperComponent extends Component {
    static async getInitialProps(ctx) {
      const generalRes = await getGeneralAsync();
      const general = await generalRes.json();

      const innerProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
      return { ...innerProps, general };
    }

    render() {
      const { user, general } = this.props;
      return (
        <Layout general={general} user={user}>
          <WrappedComponent {...this.props} />
        </Layout>
      );
    }
  };
};

export default withLayoutAsync;
