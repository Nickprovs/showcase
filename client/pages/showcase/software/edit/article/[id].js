import withAuthAsync from "../../../../../components/common/withAuthAsync";
import withLayoutAsync from "../../../../../components/common/withLayoutAsync";
import Form from "../../../../../components/common/form";
import CustomJoi from "../../../../../misc/customJoi";
import { getSoftwareAsync, getSoftwareCategoriesAsync, updateSoftwareAsync } from "../../../../../services/softwareService";
import Head from "next/head";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../../util/routerUtilities";
import StringUtilities from "../../../../../util/stringUtilities";

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

    return { software: software, categories: categories };
  }

  constructor() {
    super();

    this.state.data = { title: "", slug: "", category: null, image: "", description: "", body: "", tags: "" };
    this.state.errors = {};
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
  });

  getSoftwareFromPassingState() {
    const { categories } = this.props;
    let software = { ...this.state.data };

    let category = software.category;
    delete software.category;
    software.categoryId = category._id;

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
            {this.renderSelect("category", "CATEGORY", "Select Category", categories.items, "name")}
            {this.renderTextInput("image", "IMAGE")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderHtmlEditor("body", "BODY")}
            {this.renderTextInput("tags", "TAGS")}
            {this.renderButton("UPDATE")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Article), true);
