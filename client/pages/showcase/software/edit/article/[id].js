import withAuthAsync from "../../../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../../../components/common/hoc/withLayoutAsync";
import Form from "../../../../../components/common/form/form";
import BasicButton from "../../../../../components/common/button/basicButton";
import CustomJoi from "../../../../../misc/customJoi";
import { getSoftwareAsync, getSoftwareCategoriesAsync, updateSoftwareAsync } from "../../../../../services/softwareService";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../../util/routerUtilities";
import StringUtilities from "../../../../../util/stringUtilities";
import ExtendedFormUtilities from "../../../../../util/extendedFormUtilities";
import Head from "next/head";
import FormatUtilities from "../../../../../util/formatUtilities";
import ThemeUtilities from "../../../../../util/themeUtilities";

class Article extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the software
    let software = null;
    try {
      const softwareRes = await getSoftwareAsync(id);
      software = await softwareRes.json();
    } catch (ex) {
      software = null;
    }

    //Get categories for form
    let categories = null;
    try {
      let categoriesRes = await getSoftwareCategoriesAsync();
      categories = await categoriesRes.json();
    } catch (ex) {
      categories = null;
    }

    //Get theme data for tinymce init
    let darkModeOn = ThemeUtilities.getSavedDarkModeOnStatus(context);

    return { software, categories, darkModeOn };
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

  async componentDidMount() {
    const { software, categories } = this.props;
    if (!software) {
      toast.error("Couldn't get software. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/software", 2000);
      return;
    }

    if (!categories) {
      toast.error("Couldn't get categories. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/software", 2000);
      return;
    }

    this.getStateDataFromSoftware(software);
  }

  getStateDataFromSoftware(software) {
    this.setState({
      data: {
        title: software.title,
        slug: software.slug,
        category: software.category,
        image: software.image,
        description: software.description,
        body: software.body,
        tags: StringUtilities.getCsvStringFromArray(software.tags),
        ...ExtendedFormUtilities.getAddressableHighlightPropertiesObjFromArray(software.addressableHighlights),
      },
    });
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

  getSoftwareFromPassingState() {
    const { categories } = this.props;
    let software = { ...this.state.data };

    //Format Category
    let category = software.category;
    delete software.category;
    software.categoryId = category._id;

    //Format Addressable Highlights
    software.addressableHighlights = ExtendedFormUtilities.getAddressableHighlightArrayAndFormatObj(software);

    //Format Tags
    let tagsString = software.tags;
    delete software.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    software.tags = tagsArray;

    return software;
  }

  doSubmit = async () => {
    let originalSoftware = this.props.software;
    let software = this.getSoftwareFromPassingState();
    software._id = originalSoftware._id;

    let res = null;
    //Try and post the new category
    try {
      res = await updateSoftwareAsync(software);
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
    Router.push("/showcase/software");
  };

  render() {
    const { showOptional } = this.state;
    let { categories, general, darkModeOn } = this.props;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <script key="tinyMCE" type="text/javascript" src="/scripts/tinymce/tinymce.min.js"></script>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Edit Software", general ? general.title : "Showcase")}</title>
          <meta name="robots" content="noindex" />
          <meta name="description" content="Edit an existing software." />
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
                this.setState({ showOptional: !showOptional });
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

            {this.renderButton("UPDATE")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Article), true);
