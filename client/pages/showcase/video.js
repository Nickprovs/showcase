import Layout from "../../components/layout";
import videoStyles from "../../styles/video.module.css";
import withAuthAsync from "../../components/common/withAuthAsync";
import { Component } from "react";
import { getVideosAsync, deleteVideoAsync, getVideoCategoriesAsync, deleteVideoCategoryAsync } from "../../services/videoService";

const pageSize = 5;

class Video extends Component {
  static async getInitialProps(context) {
    const res = await getVideosAsync();
    return {
      videos: res.videos,
    };
  }

  static async getInitialProps(context) {
    let pageQueryParam = context.query.page ? parseInt(context.query.page) : 1;
    let searchQueryParam = context.query.search ? context.query.search : "";
    let categoryQueryParam = context.query.category ? context.query.category : "";

    const options = {
      page: pageQueryParam,
      search: searchQueryParam,
      category: categoryQueryParam,
    };

    return await Video.getVideoData(options);
  }

  static async getVideoData(options) {
    let page = options.page ? options.page : 1;
    let search = options.search ? options.search : "";
    let category = options.category ? options.category : "";

    const getQueryParams = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search: search,
      category: category,
    };

    const videosRes = await getVideosAsync(getQueryParams);
    const videos = await videosRes.json();

    let res = await getVideoCategoriesAsync();
    let categories = await res.json();
    categories.items = [{ _id: "", slug: "", name: "All" }, ...categories.items];

    return {
      videos: videos.items,
      currentPage: page,
      totalVideosCount: videos.total,
      initialSearchProp: search,
      categories: categories.items,
    };
  }

  constructor(props) {
    super(props);
    this.videoContainerRefs = [];
    this.state.searchText = this.props.initialSearchProp;
  }

  state = {
    searchText: "",
    videos: [],
    totalVideosCount: 0,
    currentPage: 1,
    categories: [],
    currentCategory: null,
  };

  componentDidMount() {
    const { videos, categories, currentPage, totalVideosCount, initialSearchProp } = this.props;

    //Get the current category
    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];

    this.setState({ currentCategory: currentCategory });
    this.setState({ videos: videos });
    this.setState({ currentPage: currentPage });
    this.setState({ totalVideosCount: totalVideosCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });
  }

  componentDidUpdate(prevProps, prevState) {
    const { videos, currentPage, categories, totalVideosCount } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.videos !== videos) this.setState({ videos });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalVideosCount !== totalVideosCount) this.setState({ totalVideosCount });

    //If there's a category in the query and it's different than the current category
    if (Router.query.category != currentCategory.slug) {
      let matchingCategory = categories.filter((c) => c.slug === Router.query.category)[0];
      matchingCategory = matchingCategory ? matchingCategory : categories.filter((c) => c._id === "")[0];
      if (prevState.currentCategory !== matchingCategory) this.setState({ currentCategory: matchingCategory });
    }
  }

  setVideoContainerRefs = (ref) => {
    this.videoContainerRefs.push(ref);
  };

  componentDidMount() {
    for (let videoContainer of this.videoContainerRefs) videoContainer.firstElementChild.className += videoStyles.containerFitImage;
  }

  render() {
    const { videos, user } = this.props;

    return (
      <Layout user={user}>
        <div className={videoStyles.container}>
          {videos.map((video, i) => (
            <div key={video._id} className={videoStyles.item}>
              <div className={videoStyles.title}>
                <h2>{video.title.toUpperCase()}</h2>
              </div>
              <div className={videoStyles.video}>
                {/*TODO: Changed to iFrame or Video Tag*/}
                <div
                  style={{ width: "100%", height: "100%" }}
                  ref={this.setVideoContainerRefs}
                  dangerouslySetInnerHTML={{
                    className: videoStyles.containerFitImage,
                    __html: video.markup,
                  }}
                ></div>
              </div>
              <div className={videoStyles.text}>
                <label>{video.description}</label>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }
}

export default withAuthAsync(Video);
