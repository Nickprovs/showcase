import Layout from "../../components/layout";
import withAuthAsync from "../../components/common/withAuthAsync";
import Form from "../../components/common/form";
import CustomJoi from "../../misc/customJoi";
import Head from "next/head";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../util/routerUtilities";
import StringUtilities from "../../util/stringUtilities";
import { updateGeneralAsync, getGeneralAsync } from "../../services/generalService";

class Primary extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the blog
    let data = null;
    try {
      const generalRes = await getGeneralAsync();
      data = await generalRes.json();
    } catch (ex) {
      data = null;
    }

    return { general: data };
  }

  constructor() {
    super();

    this.state.data = { title: "", footnote: "", github: "", linkedin: "", instagram: "" };
    this.state.errors = {};
  }

  async componentDidMount() {
    const { general } = this.props;
    if (!general) {
      toast.error("Couldn't get general content.. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/index", 2000);
      return;
    }
    this.getStateDataFromGeneral(general);
  }

  getStateDataFromGeneral(general) {
    this.setState({
      data: {
        title: general.title,
        footnote: general.footnote,
        github: general.socialLinks.github ? general.socialLinks.github : "",
        linkedin: general.socialLinks.linkedin ? general.socialLinks.linkedin : "",
        instagram: general.socialLinks.instagram ? general.socialLinks.instagram : "",
      },
    });
  }

  schema = CustomJoi.object({
    title: CustomJoi.string().min(2).max(64).required(),
    footnote: CustomJoi.string().min(5).max(256).required(),
    github: CustomJoi.string().min(5).max(256).required(),
    linkedin: CustomJoi.string().min(5).max(256).required(),
    instagram: CustomJoi.string().min(5).max(256).required(),
  });

  getGeneralFromPassingState() {
    let general = { ...this.state.data };

    general.socialLinks = {
      instagram: general.instagram,
      github: general.github,
      linkedin: general.linkedin,
    };

    delete general.linkedin;
    delete general.github;
    delete general.instagram;

    return general;
  }

  doSubmit = async () => {
    let general = this.getGeneralFromPassingState();
    let res = null;
    //Try and post the new category
    try {
      res = await updateGeneralAsync(general);
    } catch (ex) {
      let errorMessage = `Error: ${ex}`;
      console.log(errorMessage);
      toast.error(errorMessage);
      return;
    }
    if (!res.ok) {
      let body = "";
      //TODO: Parse Text OR JSON
      body = await res.text();
      let errorMessage = `Error: ${res.status} - ${body}`;
      console.log(errorMessage);
      toast.error(errorMessage);
      return;
    }
    //TODO: Disallow posting duplicate category at server level.
    Router.push("/index");
  };

  render() {
    let { user } = this.props;
    return (
      <div>
        <Layout user={user}>
          <div className="standardPadding">
            <form onSubmit={this.handleSubmit}>
              {this.renderTextInput("title", "TITLE")}
              {this.renderTextInput("footnote", "FOOTNOTE")}
              {this.renderTextInput("github", "GITHUB")}
              {this.renderTextInput("linkedin", "LINKEDIN")}
              {this.renderTextInput("instagram", "INSTAGRAM")}
              {this.renderButton("UPDATE")}
            </form>
          </div>
        </Layout>
      </div>
    );
  }
}

export default withAuthAsync(Primary, true);
