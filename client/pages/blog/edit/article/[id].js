import Layout from "../../../../components/layout";
import withAuthAsync from "../../../../components/common/withAuthAsync";
import Form from "../../../../components/common/form";
import CustomJoi from "../../../../misc/customJoi";
import {getBlogAsync, getBlogCategoriesAsync, saveBlogAsync} from "../../../../services/blogService";
import Head from 'next/head';
import { toast, cssTransition } from 'react-toastify';
import Router from "next/router";
import RouterUtilities from "../../../../util/routerUtilities";
import StringUtilities from "../../../../util/stringUtilities";

class Article extends Form{
  static async getInitialProps(context) {

    const { id } = context.query;

    //Get the blog
    let blog = null;
    try{
      const blogRes = await getBlogAsync(id);
      blog = await blogRes.json();
    }
    catch(ex){
      blog = null;
    }
    
    //Get categories for form
    let categories = null;
    try{
      let categoriesRes = await getBlogCategoriesAsync();
      categories = await categoriesRes.json();
    }
    catch(ex){
      categories = null;
    }

    return {blog: blog, categories: categories};
  }

  constructor() {
    super();

    this.state.data = { title: "", slug: "", category: "", image: "", description: "", body: "", tags: ""};
    this.state.errors = {};
  }

  componentDidMount(){
    const {blog, categories} = this.props;
    if(!blog){
      toast.error("Couldn't get blog. Redirecting back.", {autoClose: 1500});
      RouterUtilities.routeInternalWithDelayAsync("/blog", 2000);
    }

    if(!categories){
      toast.error("Couldn't get categories. Redirecting back.", {autoClose: 1500});
      RouterUtilities.routeInternalWithDelayAsync("/blog", 2000);
    }

    this.getStateDataFromBlog(blog);
  }

  getStateDataFromBlog(blog){
    this.setState({data: {
      title: blog.title,
      slug: blog.slug,
      category: blog.category.name,
      image: blog.image,
      description: blog.description,
      body: blog.body,
      tags: StringUtilities.getCsvStringFromArray(blog.tags)
    }});
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
      .max(1000)
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
        res = await saveBlogAsync(blog);
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
