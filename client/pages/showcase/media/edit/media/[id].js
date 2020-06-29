import withAuthAsync from "../../../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../../../components/common/hoc/withLayoutAsync";
import Form from "../../../../../components/common/form/form";
import BasicButton from "../../../../../components/common/button/basicButton";
import CustomJoi from "../../../../../misc/customJoi";
import { getMediaAsync, getMediaCategoriesAsync, updateMediaAsync } from "../../../../../services/mediaService";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../../util/routerUtilities";
import StringUtilities from "../../../../../util/stringUtilities";
import ExtendedFormUtilities from "../../../../../util/extendedFormUtilities";
import Head from "next/head";
import FormatUtilities from "../../../../../util/formatUtilities";
import initializeDomPurify from "../../../../../misc/customDomPurify";
import { sanitize } from "isomorphic-dompurify";

class Media extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the media
    let media = null;
    try {
      const mediaRes = await getMediaAsync(id);
      media = await mediaRes.json();
    } catch (ex) {
      media = null;
    }

    //Get categories for form
    let categories = null;
    try {
      let categoriesRes = await getMediaCategoriesAsync();
      categories = await categoriesRes.json();
    } catch (ex) {
      categories = null;
    }

    return { media: media, categories: categories };
  }

  constructor() {
    super();

    this.state.data = {
      title: "",
      category: null,
      description: "",
      markup: "",
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
    const { media, categories } = this.props;
    if (!media) {
      toast.error("Couldn't get media. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/media", 2000);
      return;
    }

    if (!categories) {
      toast.error("Couldn't get categories. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/media", 2000);
      return;
    }

    initializeDomPurify();
    this.getStateDataFromMedia(media);
  }

  getStateDataFromMedia(media) {
    console.log("purifying");
    this.setState({
      data: {
        title: media.title,
        category: media.category,
        description: media.description,
        markup: sanitize(media.markup),
        tags: StringUtilities.getCsvStringFromArray(media.tags),
        ...ExtendedFormUtilities.getAddressableHighlightPropertiesObjFromArray(media.addressableHighlights),
      },
    });
  }

  schema = CustomJoi.object({
    title: CustomJoi.string().min(2).max(64).required(),
    category: CustomJoi.object({
      _id: CustomJoi.string().min(1).required(),
      name: CustomJoi.string().min(1).required(),
      slug: CustomJoi.string().min(1).required(),
    }),
    description: CustomJoi.string().min(2).max(128).required(),
    markup: CustomJoi.string().min(2).required(),
    tags: CustomJoi.csvString().required().min(3).max(10),
    addressableHighlightLabel1: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress1: CustomJoi.string().allow("").max(1024).optional(),
    addressableHighlightLabel2: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress2: CustomJoi.string().allow("").max(1024).optional(),
    addressableHighlightLabel3: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress3: CustomJoi.string().allow("").max(1024).optional(),
  });

  getMediaFromPassingState() {
    const { categories } = this.props;
    let media = { ...this.state.data };

    //Format Category
    let category = media.category;
    delete media.category;
    media.categoryId = category._id;

    //Format Addressable Highlights
    media.addressableHighlights = ExtendedFormUtilities.getAddressableHighlightArrayAndFormatObj(media);

    //Format Tags
    let tagsString = media.tags;
    delete media.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    media.tags = tagsArray;

    return media;
  }

  doSubmit = async () => {
    let originalMedia = this.props.media;
    let media = this.getMediaFromPassingState();
    media._id = originalMedia._id;

    let res = null;
    //Try and post the new category
    try {
      res = await updateMediaAsync(media);
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
    Router.push("/showcase/media");
  };

  render() {
    let { categories, general } = this.props;
    const { showOptional } = this.state;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <script key="tinyMCE" type="text/javascript" src="/scripts/tinymce/tinymce.min.js"></script>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Edit Media", general ? general.title : "Showcase")}</title>
          <meta name="description" content="Edit an existing media." />
          <meta name="robots" content="noindex" />
        </Head>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderSelect("category", "CATEGORY", "Select Category", categories.items, "name")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderTextArea("markup", "MARKUP (EMBED CODE)")}
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

export default withAuthAsync(withLayoutAsync(Media), true);
