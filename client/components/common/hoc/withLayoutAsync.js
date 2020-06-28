import Layout from "../../layout/layout.js";
import { Component } from "react";
import { getGeneralAsync } from "../../../services/generalService";

const withLayoutAsync = (WrappedComponent) => {
  return class LayoutWrapperComponent extends Component {
    static async getInitialProps(ctx) {
      let generalRes = null;
      let general = null;
      try {
        generalRes = await getGeneralAsync();
        general = await generalRes.json();
      } catch (ex) {
        console.log("Issue getting general data from server necessary for layout", ex);
      }

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
