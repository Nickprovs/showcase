import withAuthAsync from "../../../../components/common/withAuthAsync";
import withLayoutAsync from "../../../../components/common/withLayoutAsync";
import Form from "../../../../components/common/form";
import CustomJoi from "../../../../misc/customJoi";
import { getBlogCategoryAsync, updateBlogCategoryAsync } from "../../../../services/blogService";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../util/routerUtilities";

class Category extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the category
    let category = null;
    try {
      let categoryRes = await getBlogCategoryAsync(id);
      category = await categoryRes.json();
    } catch (ex) {
      category = null;
    }

    return { category };
  }

  constructor() {
    super();

    this.state.data = { name: "", slug: "" };
    this.state.errors = {};
  }

  async componentDidMount() {
    const { category } = this.props;
    if (!category) {
      toast.error("Couldn't get category. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/blog", 2000);
      return;
    }

    this.getStateDataFromCategory(category);
  }

  getStateDataFromCategory(category) {
    this.setState({
      data: {
        name: category.name,
        slug: category.slug,
      },
    });
  }

  schema = CustomJoi.object({
    name: CustomJoi.string().min(2).max(50).required(),
    slug: CustomJoi.string()
      .min(2)
      .max(128)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required(),
  });

  doSubmit = async () => {
    let originalCategory = this.props.category;
    let category = { ...this.state.data };
    category._id = originalCategory._id;

    let res = null;
    //Try and post the new category
    try {
      res = await updateBlogCategoryAsync(category);
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
    return (
      <div>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("name", "NAME")}
            {this.renderTextInput("slug", "SLUG")}
            {this.renderButton("UPDATE")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Category), true);
