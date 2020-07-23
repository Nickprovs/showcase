import withAuthAsync from "../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../components/common/hoc/withLayoutAsync";
import Form from "../../../components/common/form/form";
import BasicButton from "../../../components/common/button/basicButton";
import CustomJoi from "../../../misc/customJoi";
import { getPhotoCategoriesAsync, createPhotoAsync } from "../../../services/photoService";
import { toast } from "react-toastify";
import Router from "next/router";
import ExtendedFormUtilities from "../../../util/extendedFormUtilities";
import Head from "next/head";
import FormatUtilities from "../../../util/formatUtilities";

class Photo extends Form {
  static async getInitialProps(context) {
    let res = await getPhotoCategoriesAsync();
    let categories = await res.json();
    return { categories: categories };
  }

  constructor() {
    super();

    this.state.data = {
      title: "",
      category: null,
      description: "",
      orientation: "",
      displaySize: "",
      source: "",
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
    category: CustomJoi.object({
      _id: CustomJoi.string().min(1).required(),
      name: CustomJoi.string().min(1).required(),
      slug: CustomJoi.string().min(1).required(),
    }),
    description: CustomJoi.string().min(2).max(128).required(),
    orientation: CustomJoi.string().valid("square", "landscape", "panorama", "portrait", "vertorama").required(),
    displaySize: CustomJoi.string().valid("small", "medium", "large").required(),
    source: CustomJoi.string().min(2).max(1000).required(),
    tags: CustomJoi.csvString().required().min(3).max(10),
    addressableHighlightLabel1: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress1: CustomJoi.string().allow("").max(1024).optional(),
    addressableHighlightLabel2: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress2: CustomJoi.string().allow("").max(1024).optional(),
    addressableHighlightLabel3: CustomJoi.string().allow("").max(16).optional(),
    addressableHighlightAddress3: CustomJoi.string().allow("").max(1024).optional(),
  });

  getPhotoFromPassingState() {
    const { categories } = this.props;
    let photo = { ...this.state.data };

    //Format Category
    let category = photo.category;
    delete photo.category;
    photo.categoryId = category._id;

    //Format Addressable Highlights
    photo.addressableHighlights = ExtendedFormUtilities.getAddressableHighlightArrayAndFormatObj(photo);

    //Format Tags
    let tagsString = photo.tags;
    delete photo.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    photo.tags = tagsArray;

    return photo;
  }

  doSubmit = async () => {
    const photo = this.getPhotoFromPassingState();
    console.log(photo);
    let res = null;
    //Try and post the new category
    try {
      res = await createPhotoAsync(photo);
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

    Router.push("/photo");
  };

  render() {
    let { categories, general } = this.props;
    const { showOptional } = this.state;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <script key="tinyMCE" type="text/javascript" src="/scripts/tinymce/tinymce.min.js"></script>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Post Photo", general ? general.title : "Showcase")}</title>
          <meta name="description" content="Post a new photo." />
          <meta name="robots" content="noindex" />
        </Head>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderSelect("category", "CATEGORY", "Select Category", categories.items, "name")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderSelect("orientation", "ORIENTATION", "Select Orientation", ["square", "landscape", "panorama", "portrait", "vertorama"], null)}
            {this.renderSelect("displaySize", "Display Size", "Select Display Size", ["small", "medium", "large"], null)}
            {this.renderTextInput("tags", "TAGS")}
            {this.renderTextInput("source", "SOURCE")}

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

export default withAuthAsync(withLayoutAsync(Photo), true);
