import Layout from "../../../components/layout";
import withAuthAsync from "../../../components/common/withAuthAsync";
import Form from "../../../components/common/form";
import CustomJoi from "../../../misc/customJoi";
import {getBlogCategoriesAsync} from "../../../services/blogService";
import { Editor } from '@tinymce/tinymce-react';
import Head from 'next/head';

class Article extends Form{

  static async getInitialProps(context) {
    let categories = await getBlogCategoriesAsync();
    return {categories: categories};
  }

  constructor() {
    super();

    this.state.mounted = false;
    this.state.data = { title: "", slug: "", category: "", image: "", description: "", tags: ""};
    this.state.errors = {};
  }

  componentDidMount(){
    this.setState({mounted: true});
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
      <div>
        <Head>
          <script src="/static/scripts/tinymce/tinymce.min.js"></script>
        </Head>
        <Layout>
        <div className="standardPadding">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextInput("title", "TITLE")}
            {this.renderTextInput("slug", "SLUG")}
            {this.renderSelect("category", "CATEGORY", "", categories.items, "name")}
            {this.renderTextInput("image", "IMAGE")}
            {this.renderTextArea("description", "DESCRIPTION")}

            {/* Render the editor client side. */}
            <p>TODO: See if "value" tag works and bind content to value -- extend form somehow to do final validation?</p>
            {this.state.mounted &&             
              <Editor    
                initialValue="<p>This is the initial content of the editor</p>"
                init={{
                  width: "95%",
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
                }}
                onEditorChange={this.handleEditorChange}
            />}
            
            {this.renderTextInput("tags", "TAGS")}
            {this.renderButton("POST")}
          </form>
        </div>
      </Layout>
      </div>

    );
  }
}

export default withAuthAsync(Article, true);
