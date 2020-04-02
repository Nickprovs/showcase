import Layout from "../../../components/layout";
import withAuthAsync from "../../../components/common/withAuthAsync";
import Form from "../../../components/common/form";
import CustomJoi from "../../../misc/customJoi";
import {getBlogCategoriesAsync} from "../../../services/blogService";
class Article extends Form{

  static async getInitialProps(context) {
    let categories = await getBlogCategoriesAsync();
    return {categories: categories};
  }

  constructor() {
    super();

    this.state.data = { title: "", slug: "", category: "", image: "", description: "", tags: ""};
    this.state.errors = {};
  }

  schema = CustomJoi.object({
    title: CustomJoi.string()
      .min(2)
      .max(64)
      .required(),
    slug: CustomJoi.string()
      .min(2)
      .max(128)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required(),
    category: CustomJoi.string()
      .min(1)
      .required()
      .label("Category"),
    description: CustomJoi.string()
      .min(1)
      .required()
      .label("Description"),
    image: CustomJoi.string()
      .min(2)
      .max(1000)
      .required(),
    tags: CustomJoi.csvString()
        .required()
        .min(3)
        .max(10)
  });
  
  doSubmit = async () => {
    const { username, password } = this.state.data;
    try{
      const res = await loginAsync(username, password);
      if(res.status === 200)
        Router.push("/");
    }
    catch(ex){
      console.log(ex);
    }
  };
  
  render() {
    let {categories} = this.props;
    categories = categories ? categories : [];
    return (
      <Layout>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderTextInput("slug", "SLUG")}
            {this.renderSelect("category", "CATEGORY", "", categories.items, "name")}
            {this.renderTextInput("image", "IMAGE")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderTextInput("tags", "TAGS")}

            {this.renderButton("POST")}
          </form>
        </div>
      </Layout>
    );
  }
}

export default withAuthAsync(Article, true);
