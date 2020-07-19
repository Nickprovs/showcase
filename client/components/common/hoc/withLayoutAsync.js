import Layout from "../../layout/layout.js";
import { Component } from "react";
import { getGeneralAsync } from "../../../services/generalService";
import ThemeUtilities from "../../../util/themeUtilities";

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

      let darkModeOn = ThemeUtilities.getSavedDarkModeOnStatus(ctx);

      const innerProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
      return { ...innerProps, general, darkModeOn };
    }

    render() {
      const { user, general, darkModeOn } = this.props;

      return (
        <Layout general={general} user={user} darkModeOn={darkModeOn}>
          <WrappedComponent {...this.props} />
        </Layout>
      );
    }
  };
};

export default withLayoutAsync;
