import withAuthAsync from "../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../components/common/hoc/withLayoutAsync";
import Form from "../../../components/common/form/form";
import BasicButton from "../../../components/common/button/basicButton";
import CustomJoi from "../../../misc/customJoi";
import { getPortfolioCategoriesAsync, createPortfolioAsync } from "../../../services/portfolioService";
import { toast } from "react-toastify";
import Router from "next/router";
import ExtendedFormUtilities from "../../../util/extendedFormUtilities";
import Head from "next/head";
import FormatUtilities from "../../../util/formatUtilities";
import ThemeUtilities from "../../../util/themeUtilities";

class Article extends Form {
  static async getInitialProps(context) {
    let res = await getPortfolioCategoriesAsync();
    let categories = await res.json();
    let darkModeOn = ThemeUtilities.getSavedDarkModeOnStatus(context);

    return { categories, darkModeOn };
  }

  constructor() {
    super();

    this.state.data = {
      title: "",
      slug: "",
      category: null,
      image: "",
      description: "",
      body: "",
      tags: "",
      addressableHighlightLabel1: "",
      addressableHighlightAddress1: "",
      addressableHighlightLabel2: "",
      addressableHighlightAddress2: "",
      addressableHighlightLabel3: "",
      addressableHighlightAddress3: "",
    };
    this.state.errors = {};
    this.state.showOptional = false;
  }

  schema = CustomJoi.object({
    title: CustomJoi.string().min(2).max(64).required(),
    slug: CustomJoi.string()
      .min(2)
      .max(128)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required(),
    category: CustomJoi.object({
      _id: CustomJoi.string().min(1).required(),
      name: CustomJoi.string().min(1).required(),
      slug: CustomJoi.string().min(1).required(),
    }),
    description: CustomJoi.string().min(1).required().label("Description"),
    image: CustomJoi.string().min(2).max(1000).required(),
    body: CustomJoi.string().min(10).required(),
    tags: CustomJoi.csvString().required().min(3).max(10),
    addressableHighlightLabel1: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress1: CustomJoi.string().allow("").max(1024).optional(),
    addressableHighlightLabel2: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress2: CustomJoi.string().allow("").max(1024).optional(),
    addressableHighlightLabel3: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress3: CustomJoi.string().allow("").max(1024).optional(),
  });

  getPortfolioFromPassingState() {
    const { categories } = this.props;
    let portfolio = { ...this.state.data };

    //Format Category
    let category = portfolio.category;
    delete portfolio.category;
    portfolio.categoryId = category._id;

    //Format Addressable Highlights
    portfolio.addressableHighlights = ExtendedFormUtilities.getAddressableHighlightArrayAndFormatObj(portfolio);

    //Format Tags
    let tagsString = portfolio.tags;
    delete portfolio.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    portfolio.tags = tagsArray;

    return portfolio;
  }

  doSubmit = async () => {
    const portfolio = this.getPortfolioFromPassingState();
    console.log(portfolio);
    let res = null;
    //Try and post the new category
    try {
      res = await createPortfolioAsync(portfolio);
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

    Router.push("/portfolio");
  };

  render() {
    let { categories, general, darkModeOn } = this.props;
    const { showOptional } = this.state;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <script key="tinyMCE" type="text/javascript" src="/scripts/tinymce/tinymce.min.js"></script>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Post Portfolio", general ? general.title : "Showcase")}</title>
          <meta name="description" content="Post a new portfolio." />
          <meta name="robots" content="noindex" />
        </Head>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderTextInput("slug", "SLUG")}
            {this.renderSelect("category", "CATEGORY", "Select Category", categories.items, "name")}
            {this.renderTextInput("image", "IMAGE")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderHtmlEditor("body", "BODY", darkModeOn)}
            {this.renderTextInput("tags", "TAGS")}

            <BasicButton
              onClick={(e) => {
                e.preventDefault();
                this.setState({ showOptional: !this.state.showOptional });
              }}
              style={{ marginTop: "25px", marginBottom: "20px", textAlign: "center", display: "block" }}
            >
              Toggle Optional
            </BasicButton>
            {showOptional && (
              <div>
                <h3 style={{ marginLeft: "0px", textAlign: "left" }}>Addressable Highlight 1 (Optional)</h3>
                {this.renderTextInput("addressableHighlightLabel1", "LABEL")}
                {this.renderTextInput("addressableHighlightAddress1", "URL")}

                <h3 style={{ marginLeft: "0px", textAlign: "left" }}>Addressable Highlight 2 (Optional)</h3>
                {this.renderTextInput("addressableHighlightLabel2", "LABEL")}
                {this.renderTextInput("addressableHighlightAddress2", "URL")}

                <h3 style={{ marginLeft: "0px", textAlign: "left" }}>Addressable Highlight 3 (Optional)</h3>
                {this.renderTextInput("addressableHighlightLabel3", "LABEL")}
                {this.renderTextInput("addressableHighlightAddress3", "URL")}
              </div>
            )}
            {this.renderButton("POST")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Article), true);
