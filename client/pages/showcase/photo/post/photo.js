import withAuthAsync from "../../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../../components/common/hoc/withLayoutAsync";
import Form from "../../../../components/common/form/form";
import CustomJoi from "../../../../misc/customJoi";
import { getPhotoCategoriesAsync, createPhotoAsync } from "../../../../services/photoService";
import Head from "next/head";
import { toast } from "react-toastify";
import Router from "next/router";

class Photo extends Form {
  static async getInitialProps(context) {
    let res = await getPhotoCategoriesAsync();
    let categories = await res.json();
    return { categories: categories };
  }

  constructor() {
    super();

    this.state.data = { title: "", category: null, description: "", orientation: "", displaySize: "", source: "", tags: "" };
    this.state.errors = {};
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
  });

  getPhotoFromPassingState() {
    const { categories } = this.props;
    let photo = { ...this.state.data };

    let category = photo.category;
    delete photo.category;
    photo.categoryId = category._id;

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

    Router.push("/showcase/photo");
  };

  render() {
    let { categories } = this.props;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <script key="tinyMCE" type="text/javascript" src="/scripts/tinymce/tinymce.min.js"></script>
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
            {this.renderButton("POST")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Photo), true);
