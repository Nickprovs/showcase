import Layout from "../../../../components/layout";
import withAuthAsync from "../../../../components/common/withAuthAsync";
import Form from "../../../../components/common/form";
import CustomJoi from "../../../../misc/customJoi";
import { getVideoCategoriesAsync, createVideoAsync } from "../../../../services/videoService";
import Head from "next/head";
import { toast } from "react-toastify";
import Router from "next/router";

class Video extends Form {
  static async getInitialProps(context) {
    let res = await getVideoCategoriesAsync();
    let categories = await res.json();
    return { categories: categories };
  }

  constructor() {
    super();

    this.state.data = { title: "", category: "", description: "", markup: "", tags: "" };
    this.state.errors = {};
  }

  schema = CustomJoi.object({
    title: CustomJoi.string().min(2).max(64).required(),
    category: CustomJoi.string().min(1).required().label("Category"),
    description: CustomJoi.string().min(2).max(128).required(),
    markup: CustomJoi.string().min(2).required(),
    tags: CustomJoi.csvString().required().min(3).max(10),
  });

  getVideoFromPassingState() {
    const { categories } = this.props;
    let video = { ...this.state.data };

    let category = video.category;
    delete video.category;
    video.categoryId = categories.items.filter((c) => c.name == category)[0]._id;

    let tagsString = video.tags;
    delete video.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    video.tags = tagsArray;

    return video;
  }

  doSubmit = async () => {
    const video = this.getVideoFromPassingState();
    let res = null;
    //Try and post the new category
    try {
      res = await createVideoAsync(video);
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

    Router.push("/showcase/video");
  };

  render() {
    let { categories, user } = this.props;
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
              {this.renderSelect("category", "CATEGORY", "", categories.items, "name")}
              {this.renderTextArea("description", "DESCRIPTION")}
              {this.renderTextArea("markup", "MARKUP (EMBED CODE)")}
              {this.renderTextInput("tags", "TAGS")}
              {this.renderButton("POST")}
            </form>
          </div>
        </Layout>
      </div>
    );
  }
}

export default withAuthAsync(Video, true);
