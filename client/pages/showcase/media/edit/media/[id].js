import withAuthAsync from "../../../../../components/common/withAuthAsync";
import withLayoutAsync from "../../../../../components/common/withLayoutAsync";
import Form from "../../../../../components/common/form";
import CustomJoi from "../../../../../misc/customJoi";
import { getMediaAsync, getMediaCategoriesAsync, updateMediaAsync } from "../../../../../services/mediaService";
import Head from "next/head";
import { toast, cssTransition } from "react-toastify";
import Router from "next/router";
import RouterUtilities from "../../../../../util/routerUtilities";
import StringUtilities from "../../../../../util/stringUtilities";

class Media extends Form {
  static async getInitialProps(context) {
    const { id } = context.query;

    //Get the media
    let media = null;
    try {
      const mediaRes = await getMediaAsync(id);
      media = await mediaRes.json();
    } catch (ex) {
      media = null;
    }

    //Get categories for form
    let categories = null;
    try {
      let categoriesRes = await getMediaCategoriesAsync();
      categories = await categoriesRes.json();
    } catch (ex) {
      categories = null;
    }

    return { media: media, categories: categories };
  }

  constructor() {
    super();

    this.state.data = { title: "", category: "", description: "", markup: "", tags: "" };
    this.state.errors = {};
  }

  async componentDidMount() {
    const { media, categories } = this.props;
    if (!media) {
      toast.error("Couldn't get media. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/media", 2000);
      return;
    }

    if (!categories) {
      toast.error("Couldn't get categories. Redirecting back.", { autoClose: 1500 });
      await RouterUtilities.routeInternalWithDelayAsync("/showcase/media", 2000);
      return;
    }

    this.getStateDataFromMedia(media);
  }

  getStateDataFromMedia(media) {
    this.setState({
      data: {
        title: media.title,
        category: media.category.name,
        description: media.description,
        markup: media.markup,
        tags: StringUtilities.getCsvStringFromArray(media.tags),
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

  getMediaFromPassingState() {
    const { categories } = this.props;
    let media = { ...this.state.data };

    let category = media.category;
    delete media.category;
    media.categoryId = categories.items.filter((c) => c.name == category)[0]._id;

    let tagsString = media.tags;
    delete media.tags;
    let tagsArray = tagsString.replace(/^,+|,+$/gm, "").split(",");
    tagsArray = tagsArray.map((str) => str.trim());
    media.tags = tagsArray;

    return media;
  }

  doSubmit = async () => {
    let originalMedia = this.props.media;
    let media = this.getMediaFromPassingState();
    media._id = originalMedia._id;

    let res = null;
    //Try and post the new category
    try {
      res = await updateMediaAsync(media);
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
    Router.push("/showcase/media");
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

export default withAuthAsync(withLayoutAsync(Media), true);
