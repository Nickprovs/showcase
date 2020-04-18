import Layout from "../../../../components/layout";
import withAuthAsync from "../../../../components/common/withAuthAsync";
import Form from "../../../../components/common/form";
import CustomJoi from "../../../../misc/customJoi";
import { createSoftwareCategoryAsync } from "../../../../services/softwareService";
import { toast } from "react-toastify";
import Router from "next/router";

class Category extends Form {
  constructor() {
    super();

    this.state.data = { name: "", slug: "" };
    this.state.errors = {};
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
    const { name, slug } = this.state.data;
    let res = null;

    //Try and post the new category
    try {
      res = await createSoftwareCategoryAsync(name, slug);
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
    const { user } = this.props;
    return (
      <Layout user={user}>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("name", "NAME")}
            {this.renderTextInput("slug", "SLUG")}
            {this.renderButton("POST")}
          </form>
        </div>
      </Layout>
    );
  }
}

export default withAuthAsync(Category, true);
