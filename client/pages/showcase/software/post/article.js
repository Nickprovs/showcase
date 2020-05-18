import withAuthAsync from "../../../../components/common/withAuthAsync";
import withLayoutAsync from "../../../../components/common/withLayoutAsync";
import Form from "../../../../components/common/form";
import CustomJoi from "../../../../misc/customJoi";
import { getSoftwareCategoriesAsync, createSoftwareAsync } from "../../../../services/softwareService";
import Head from "next/head";
import { toast } from "react-toastify";
import Router from "next/router";

class Article extends Form {
  static async getInitialProps(context) {
    let res = await getSoftwareCategoriesAsync();
    let categories = await res.json();
    return { categories: categories };
  }

  constructor() {
    super();

    this.state.data = { title: "", slug: "", category: "", image: "", description: "", body: "", tags: "" };
    this.state.errors = {};
  }

  schema = CustomJoi.object({
    title: CustomJoi.string().min(2).max(64).required(),
    slug: CustomJoi.string()
      .min(2)
      .max(128)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required(),
    category: CustomJoi.string().min(1).required().label("Category"),
    description: CustomJoi.string().min(1).required().label("Description"),
    image: CustomJoi.string().min(2).max(1000).required(),
    body: CustomJoi.string().min(10).required(),
    tags: CustomJoi.csvString().required().min(3).max(10),
  });

  getSoftwareFromPassingState() {
    const { categories } = this.props;
    let software = { ...this.state.data };

    let category = software.category;
    delete software.category;
    software.categoryId = categories.items.filter((c) => c.name == category)[0]._id;

    let tagsString = software.tags;
    delete software.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    software.tags = tagsArray;

    return software;
  }

  doSubmit = async () => {
    const software = this.getSoftwareFromPassingState();
    console.log(software);
    let res = null;
    //Try and post the new category
    try {
      res = await createSoftwareAsync(software);
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

    Router.push("/showcase/software");
  };

  render() {
    let { categories } = this.props;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <script key="tinyMCE" type="text/javascript" src="/static/scripts/tinymce/tinymce.min.js"></script>
        </Head>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderTextInput("slug", "SLUG")}
            {this.renderSelect("category", "CATEGORY", "", categories.items, "name")}
            {this.renderTextInput("image", "IMAGE")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderHtmlEditor("body", "BODY")}
            {this.renderTextInput("tags", "TAGS")}
            {this.renderButton("POST")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Article), true);
