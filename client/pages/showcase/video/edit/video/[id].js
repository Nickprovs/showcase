import withAuthAsync from "../../../../../components/common/withAuthAsync";
import withLayoutAsync from "../../../../../components/common/withLayoutAsync";
import Form from "../../../../../components/common/form";
import CustomJoi from "../../../../../misc/customJoi";
import { getVideoAsync, getVideoCategoriesAsync, updateVideoAsync } from "../../../../../services/videoService";
import Head from "next/head";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../../util/routerUtilities";
import StringUtilities from "../../../../../util/stringUtilities";

class Video extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the video
    let video = null;
    try {
      const videoRes = await getVideoAsync(id);
      video = await videoRes.json();
    } catch (ex) {
      video = null;
    }

    //Get categories for form
    let categories = null;
    try {
      let categoriesRes = await getVideoCategoriesAsync();
      categories = await categoriesRes.json();
    } catch (ex) {
      categories = null;
    }

    return { video: video, categories: categories };
  }

  constructor() {
    super();

    this.state.data = { title: "", category: "", description: "", markup: "", tags: "" };
    this.state.errors = {};
  }

  async componentDidMount() {
    const { video, categories } = this.props;
    if (!video) {
      toast.error("Couldn't get video. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/video", 2000);
      return;
    }

    if (!categories) {
      toast.error("Couldn't get categories. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/video", 2000);
      return;
    }

    this.getStateDataFromVideo(video);
  }

  getStateDataFromVideo(video) {
    this.setState({
      data: {
        title: video.title,
        category: video.category.name,
        description: video.description,
        markup: video.markup,
        tags: StringUtilities.getCsvStringFromArray(video.tags),
      },
    });
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
    let originalVideo = this.props.video;
    let video = this.getVideoFromPassingState();
    video._id = originalVideo._id;

    let res = null;
    //Try and post the new category
    try {
      res = await updateVideoAsync(video);
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
    Router.push("/showcase/video");
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
            {this.renderSelect("category", "CATEGORY", "", categories.items, "name")}
            {this.renderTextArea("description", "DESCRIPTION")}
            {this.renderTextArea("markup", "MARKUP (EMBED CODE)")}
            {this.renderTextInput("tags", "TAGS")}
            {this.renderButton("POST")}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Video), true);
