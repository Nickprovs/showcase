import withAuthAsync from "../../../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../../../components/common/hoc/withLayoutAsync";
import Form from "../../../../components/common/form/form";
import BasicButton from "../../../../components/common/button/basicButton";
import CustomJoi from "../../../../misc/customJoi";
import { getBlogAsync, getBlogCategoriesAsync, updateBlogAsync } from "../../../../services/blogService";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../util/routerUtilities";
import StringUtilities from "../../../../util/stringUtilities";
import ExtendedFormUtilities from "../../../../util/extendedFormUtilities";
import Head from "next/head";
import FormatUtilities from "../../../../util/formatUtilities";
import ThemeUtilities from "../../../../util/themeUtilities";
import initializeDomPurify from "../../../../misc/customDomPurify";
import { sanitize } from "isomorphic-dompurify";

class Article extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the blog
    let blog = null;
    try {
      const blogRes = await getBlogAsync(id);
      blog = await blogRes.json();
    } catch (ex) {
      blog = null;
    }

    //Get categories for form
    let categories = null;
    try {
      let categoriesRes = await getBlogCategoriesAsync();
      categories = await categoriesRes.json();
    } catch (ex) {
      categories = null;
    }

    //Get theme data (for tinymce init)
    let darkModeOn = ThemeUtilities.getSavedDarkModeOnStatus(context);

    return { blog, categories, darkModeOn };
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
    const { blog, categories } = this.props;
    if (!blog) {
      toast.error("Couldn't get blog. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/blog", 2000);
      return;
    }

    if (!categories) {
      toast.error("Couldn't get categories. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/blog", 2000);
      return;
    }

    initializeDomPurify();
    this.getStateDataFromBlog(blog);
  }

  getStateDataFromBlog(blog) {
    console.log("purifying");

    this.setState({
      data: {
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        image: blog.image,
        description: blog.description,
        body: sanitize(blog.body),
        tags: StringUtilities.getCsvStringFromArray(blog.tags),
        ...ExtendedFormUtilities.getAddressableHighlightPropertiesObjFromArray(blog.addressableHighlights),
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

  getBlogFromPassingState() {
    const { categories } = this.props;
    let blog = { ...this.state.data };

    //Format Category
    let category = blog.category;
    delete blog.category;
    blog.categoryId = category._id;

    //Format Addressable Highlights
    blog.addressableHighlights = ExtendedFormUtilities.getAddressableHighlightArrayAndFormatObj(blog);

    //Format Tags
    let tagsString = blog.tags;
    delete blog.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    blog.tags = tagsArray;

    return blog;
  }

  doSubmit = async () => {
    let originalBlog = this.props.blog;
    let blog = this.getBlogFromPassingState();
    blog._id = originalBlog._id;

    let res = null;
    //Try and post the new category
    try {
      res = await updateBlogAsync(blog);
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
    Router.push("/blog");
  };

  render() {
    let { categories, general, darkModeOn } = this.props;
    const { showOptional } = this.state;
    categories = categories ? categories : [];
    return (
      <div>
        <Head>
          <title>{FormatUtilities.getFormattedWebsiteTitle("Edit Blog", general ? general.title : "Showcase")}</title>
          <meta name="description" content="Edit an existing blog." />
          <meta name="robots" content="noindex" />
          <script key="tinyMCE" type="text/javascript" src="/scripts/tinymce/tinymce.min.js"></script>
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
