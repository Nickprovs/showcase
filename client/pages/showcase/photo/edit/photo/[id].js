import withAuthAsync from "../../../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../../../components/common/hoc/withLayoutAsync";
import Form from "../../../../../components/common/form/form";
import BasicButton from "../../../../../components/common/button/basicButton";
import CustomJoi from "../../../../../misc/customJoi";
import { getPhotoAsync, getPhotoCategoriesAsync, updatePhotoAsync } from "../../../../../services/photoService";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../../util/routerUtilities";
import StringUtilities from "../../../../../util/stringUtilities";
import ExtendedFormUtilities from "../../../../../util/extendedFormUtilities";
import Head from "next/head";
import FormatUtilities from "../../../../../util/formatUtilities";

class Photo extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the photo
    let photo = null;
    try {
      const photoRes = await getPhotoAsync(id);
      photo = await photoRes.json();
    } catch (ex) {
      photo = null;
    }

    //Get categories for form
    let categories = null;
    try {
      let categoriesRes = await getPhotoCategoriesAsync();
      categories = await categoriesRes.json();
    } catch (ex) {
      categories = null;
    }

    return { photo: photo, categories: categories };
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

  async componentDidMount() {
    const { photo, categories } = this.props;
    if (!photo) {
      toast.error("Couldn't get photo. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/photo", 2000);
      return;
    }

    if (!categories) {
      toast.error("Couldn't get categories. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/photo", 2000);
      return;
    }

    this.getStateDataFromPhoto(photo);
  }

  getStateDataFromPhoto(photo) {
    this.setState({
      data: {
        title: photo.title,
        category: photo.category,
        description: photo.description,
        orientation: photo.orientation,
        displaySize: photo.displaySize,
        source: photo.source,
        tags: StringUtilities.getCsvStringFromArray(photo.tags),
        ...ExtendedFormUtilities.getAddressableHighlightPropertiesObjFromArray(photo.addressableHighlights),
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
    let originalPhoto = this.props.photo;
    let photo = this.getPhotoFromPassingState();
    photo._id = originalPhoto._id;

    let res = null;
    //Try and post the new category
    try {
      res = await updatePhotoAsync(photo);
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
    Router.push("/showcase/photo");
  };

  render() {
    let { categories, general } = this.props;
    const { showOptional } = this.state;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <script key="tinyMCE" type="text/javascript" src="/scripts/tinymce/tinymce.min.js"></script>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Edit Photo", general ? general.title : "Showcase")}</title>
          <meta name="description" content="Edit an existing photo." />
        </Head>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderSelect("category", "CATEGORY", "Select Category", categories.items, "name")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderSelect("orientation", "ORIENTATION", "Select Orientation", ["square", "landscape", "panorama", "portrait", "vertorama"], null)}
            {this.renderSelect("displaySize", "DISPLAY SIZE", "Select Orientation", ["small", "medium", "large"], null)}
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
