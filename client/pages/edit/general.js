import withAuthAsync from "../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../components/common/hoc/withLayoutAsync";
import Form from "../../components/common/form/form";
import CustomJoi from "../../misc/customJoi";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../util/routerUtilities";
import { updateGeneralAsync, getGeneralAsync } from "../../services/generalService";
import Head from "next/head";
import FormatUtilities from "../../util/formatUtilities";

class Primary extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

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

    this.state.data = { title: "", footnote: "", portfolioTitle: "", portfolioShow: "", github: "", linkedin: "", instagram: "", resume: "" };
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
        portfolioTitle: general.portfolio.title,
        portfolioShow: general.portfolio.show.toString(),
        github: general.links.github ? general.links.github : "",
        linkedin: general.links.linkedin ? general.links.linkedin : "",
        instagram: general.links.instagram ? general.links.instagram : "",
        resume: general.links.resume ? general.links.resume : ""
      },
    });
  }

  schema = CustomJoi.object({
    title: CustomJoi.string().min(2).max(64).required(),
    footnote: CustomJoi.string().min(5).max(256).required(),
    portfolioTitle: CustomJoi.string().min(2).max(64).required(),
    portfolioShow: CustomJoi.string().min(2).max(64).required(),
    github: CustomJoi.string().optional().allow("").max(1000),
    linkedin: CustomJoi.string().optional().allow("").max(1000),
    instagram: CustomJoi.string().optional().allow("").max(1000),
    resume: CustomJoi.string().optional().allow("").max(1000),
  });

  getGeneralFromPassingState() {
    let general = { ...this.state.data };

    //Format social links data
    general.links = {
      instagram: general.instagram,
      github: general.github,
      linkedin: general.linkedin,
      resume: general.resume,
    };

    delete general.linkedin;
    delete general.github;
    delete general.instagram;
    delete general.resume;

    //Format portfolio data
    general.portfolio = {
      title: general.portfolioTitle,
      show: general.portfolioShow,
    };

    delete general.portfolioTitle;
    delete general.portfolioShow;

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
    const { general } = this.props;
    return (
      <div>
        <Head>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Edit General", general ? general.title : "Showcase")}</title>
          <meta name="description" content="Edit general data about this website." />
          <meta name="robots" content="noindex" />
        </Head>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderTextInput("footnote", "FOOTNOTE")}
            {this.renderTextInput("portfolioTitle", "PORTFOLIO ARTICLE SECTION TITLE")}
            {this.renderSelect("portfolioShow", "SHOW PORTFOLIO ARTICLE SECTION", "Select Orientation", ["true", "false"], null)}
            {this.renderTextInput("github", "GITHUB")}
            {this.renderTextInput("linkedin", "LINKEDIN")}
            {this.renderTextInput("instagram", "INSTAGRAM")}
            {this.renderTextInput("resume", "RESUME")}
            {this.renderButton("UPDATE")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Primary), true);
