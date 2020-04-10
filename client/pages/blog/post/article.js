import Layout from "../../../components/layout";
import withAuthAsync from "../../../components/common/withAuthAsync";
import Form from "../../../components/common/form";
import CustomJoi from "../../../misc/customJoi";
import {getBlogCategoriesAsync, createBlogAsync} from "../../../services/blogService";
import Head from 'next/head';
import { toast } from 'react-toastify';
import Router from "next/router";

class Article extends Form{

  static async getInitialProps(context) {
    let res = await getBlogCategoriesAsync();
    let categories = await res.json();
    return {categories: categories};
  }

  constructor() {
    super();

    this.state.data = { title: "", slug: "", category: "", image: "", description: "", body: "", tags: ""};
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
    body: CustomJoi.string()
      .min(10)
      .required(),
    tags: CustomJoi.csvString()
        .required()
        .min(3)
        .max(10)
  });

  getBlogFromPassingState(){
    const {categories} = this.props;
    let blog = {...this.state.data};

    let category = blog.category;
    delete blog.category;
    blog.categoryId = categories.items.filter(c => c.name == category)[0]._id;

    let tagsString = blog.tags;
    delete blog.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/mg, '').split(',');
    tagsArray = tagsArray.map(str => str.trim());
    blog.tags = tagsArray;

    return blog;
  }
  
  doSubmit = async () => {
    const blog = this.getBlogFromPassingState();    
    console.log(blog);
    let res = null;
    //Try and post the new category
    try{
        res = await createBlogAsync(blog);
    }
    catch(ex){
        let errorMessage = `Error: ${ex}`;
        console.log(errorMessage);
        toast.error(errorMessage);
        return;
    }
    if(!res.ok){
        let body = "";
        //TODO: Parse Text OR JSON
        body = await res.text(); 
        let errorMessage = `Error: ${res.status} - ${body}`;
        console.log(errorMessage)
        toast.error(errorMessage);    
        return;
    }

    //TODO: Disallow posting duplicate category at server level.
    Router.push("/blog");
  }
  
  render() {
    let {categories, user} = this.props;
    categories = categories ? categories : [];
    return (
      <div>
        <Head> 
          <script key="tinyMCE" type="text/javascript" src="/static/scripts/tinymce/tinymce.min.js"></script>
        </Head>
        <Layout user={user}>
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
      </Layout>
      </div>

    );
  }
}

export default withAuthAsync(Article, true);
