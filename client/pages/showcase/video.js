import Layout from "../../components/layout";
import videoStyles from "../../styles/video.module.css";
import withAuthAsync from "../../components/common/withAuthAsync";
import { Component } from "react";
import {
  getVideosAsync,
  deleteVideoAsync,
  getVideoCategoriesAsync,
  deleteVideoCategoryAsync,
  deleteFeaturedVideoAsync,
  updateFeaturedVideoAsync,
} from "../../services/videoService";
import CommonPageHeaderControls from "../../components/common/commonPageHeaderControls";
import Router from "next/router";
import Link from "next/link";
import Icon from "../../components/common/icon";
import TransparentButton from "../../components/common/transparentButton";
import BasicButton from "../../components/common/basicButton";
import Pagination from "../../components/common/pagination";
import DangerousInnerHtmlWithScript from "../../components/common/dangerousInnerHtmlWithScript";
import EmbedUtilities from "../../util/embedUtilities";

import { toast } from "react-toastify";
import reframe from "reframe.js";

const pageSize = 5;

const RemoveVideoToast = ({ closeToast, video, onRemoveVideoAsync }) => (
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={async () => await onRemoveVideoAsync(video)}>Remove</BasicButton>
  </div>
);

class Video extends Component {
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
      featured: videos.featured,
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
    featured: null,
    totalVideosCount: 0,
    currentPage: 1,
    categories: [],
    currentCategory: null,
  };

  componentDidMount() {
    const { videos, featured, categories, currentPage, totalVideosCount, initialSearchProp } = this.props;

    //Get the current category
    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];

    this.setState({ currentCategory: currentCategory });
    this.setState({ videos: videos });
    this.setState({ featured: featured });
    this.setState({ currentPage: currentPage });
    this.setState({ totalVideosCount: totalVideosCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });
  }

  componentDidUpdate(prevProps, prevState) {
    const { videos, featured, currentPage, categories, totalVideosCount } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.featured !== featured) this.setState({ featured });
    if (prevProps.videos !== videos) this.setState({ videos });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalVideosCount !== totalVideosCount) this.setState({ totalVideosCount });

    //If there's a category in the query and it's different than the current category
    if (Router.query.category != currentCategory.slug) {
      let matchingCategory = categories.filter((c) => c.slug === Router.query.category)[0];
      matchingCategory = matchingCategory ? matchingCategory : categories.filter((c) => c._id === "")[0];
      if (prevState.currentCategory !== matchingCategory) this.setState({ currentCategory: matchingCategory });
    }

    //Adjusts iframes in the page to fit based on aspect ration
    reframe("iframe");
    EmbedUtilities.loadAllAvailableEmbedHelpers();
  }

  setVideoContainerRefs = (ref) => {
    this.videoContainerRefs.push(ref);
  };

  handleSearch() {
    const { searchText } = this.state;
    if ((!searchText && !Router.query.search) || searchText === Router.query.search) return;

    let previousQuery = { ...Router.query };
    delete previousQuery.search;
    delete previousQuery.page;

    let searchQuery = {};
    if (searchText) searchQuery = { search: searchText };

    const url = {
      pathname: Router.pathname,
      query: { ...searchQuery, ...previousQuery },
    };
    Router.push(url, url, { shallow: false });
  }

  handleCategoryChange(selectedItem) {
    const category = selectedItem;

    if (category.slug === Router.query.category) return;

    let previousQuery = { ...Router.query };
    delete previousQuery.category;
    delete previousQuery.page;

    let categoryQuery = {};
    if (category._id) categoryQuery = { category: category.slug };

    const url = {
      pathname: Router.pathname,
      query: { ...categoryQuery, ...previousQuery },
    };
    Router.push(url, url, { shallow: false });
  }

  async handleRemoveVideo(video) {
    let { videos: originalVideos, totalVideosCount } = this.state;

    let res = null;
    try {
      res = await deleteVideoAsync(video._id);
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

    const videos = originalVideos.filter((p) => p._id !== video._id);
    this.setState({ videos });
    this.setState({ totalVideosCount: totalVideosCount-- });
  }

  async handleRemoveCategory(category) {
    let res = null;
    try {
      res = await deleteVideoCategoryAsync(category._id);
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

    const originalCategories = this.state.categories;
    const categories = originalCategories.filter((c) => c._id !== category._id);
    this.setState({ categories });
  }

  async handleToggleFeaturedVideo(video) {
    const { featured: originalFeatured } = this.state;

    //Try to update the featured video... update ui right away for responsiveness... revert back if issue.
    let res = null;
    try {
      if (originalFeatured && originalFeatured._id === video._id) {
        res = await deleteFeaturedVideoAsync();
        this.setState({ featured: null });
      } else {
        res = await updateFeaturedVideoAsync({ videoId: video._id });
        let featuredVideoRes = await res.json();
        this.setState({ featured: featuredVideoRes.video });
      }
    } catch (ex) {
      let errorMessage = `Error: ${ex}`;
      console.log(errorMessage);
      this.setState({ featured: originalFeatured });
      toast.error(errorMessage);
      return;
    }
    if (!res.ok) {
      let body = "";
      body = await res.text();
      let errorMessage = `Error: ${res.status} - ${body}`;
      console.log(errorMessage);
      this.setState({ featured: originalFeatured });
      toast.error(errorMessage);
      return;
    }
  }

  getEmptyVideoSectionMarkup() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>{`No videos found.`}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/director_sad.svg"></object>
        </div>
      </div>
    );
  }

  render() {
    const { user } = this.props;
    const { videos, featured, totalVideosCount, currentPage, searchText, categories, currentCategory } = this.state;

    //If we have no videos to display for this route...
    let markupBody;
    if (!videos || videos.length === 0) markupBody = this.getEmptyVideoSectionMarkup();
    else {
      markupBody = (
        <div className={videoStyles.container}>
          {videos.map((video, i) => (
            <div key={video._id} className={videoStyles.item}>
              {/*Admin Controls*/}
              {user && user.isAdmin && (
                <div className={videoStyles.adminOptions}>
                  <TransparentButton onClick={async () => await this.handleToggleFeaturedVideo(video)} style={{ color: "var(--f1)" }}>
                    <Icon className={featured && video._id === featured._id ? "fas fa-star" : "far fa-star"}></Icon>
                  </TransparentButton>
                  {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
                  <a href={`video/edit/video/${video._id}`}>
                    <TransparentButton style={{ color: "var(--f1)" }}>
                      <Icon className="fas fa-edit"></Icon>
                    </TransparentButton>
                  </a>

                  <TransparentButton
                    onClick={() =>
                      toast.info(
                        <RemoveVideoToast video={video} onRemoveVideoAsync={async (video) => await this.handleRemoveVideo(video)} />
                      )
                    }
                    style={{ color: "var(--f1)" }}
                  >
                    <Icon className="fas fa-trash"></Icon>
                  </TransparentButton>
                </div>
              )}

              <div className={videoStyles.title}>
                <h2>{video.title.toUpperCase()}</h2>
              </div>
              {/*TODO: Changed to iFrame or Video Tag*/}
              <DangerousInnerHtmlWithScript className={videoStyles.videoContainer} html={video.markup} />
              <div className={videoStyles.descriptionContainer}>
                <label>{video.description}</label>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <Layout user={user}>
        <CommonPageHeaderControls
          user={user}
          mainPagePath="showcase/video"
          mainContentType="video"
          searchText={searchText}
          onSearchTextChanged={(searchText) => this.setState({ searchText })}
          onSearch={() => this.handleSearch()}
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={(category) => this.handleCategoryChange(category)}
          onDeleteCategoryAsync={async (category) => this.handleRemoveCategory(category)}
        />
        {markupBody}
        <div className={videoStyles.paginationContainer}>
          <Pagination itemsCount={totalVideosCount} pageSize={pageSize} currentPage={currentPage} />
        </div>
      </Layout>
    );
  }
}

export default withAuthAsync(Video);
