import { Component } from "react";
import Layout from "../../components/layout";
import photoStyles from "../../styles/photo.module.css";
import FullscreenPhoto from "../../components/common/fullscreenPhoto";
import { useState } from "react";
import withAuthAsync from "../../components/common/withAuthAsync";
import { getPhotosAsync, deletePhotoAsync, getPhotoCategoriesAsync, deletePhotoCategoryAsync } from "../../services/photoService";
import Router from "next/router";
import CommonPageHeaderControls from "../../components/common/commonPageHeaderControls";

const pageSize = 15;

class Photo extends Component {
  constructor(props) {
    super(props);

    this.state.searchText = this.props.initialSearchProp;

    this.getClassesForPhoto = this.getClassesForPhoto.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
    this.handleRemovePhoto = this.handleRemovePhoto.bind(this);
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

    return await Photo.getPhotoData(options);
  }

  static async getPhotoData(options) {
    let page = options.page ? options.page : 1;
    let search = options.search ? options.search : "";
    let category = options.category ? options.category : "";

    const getQueryParams = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search: search,
      category: category,
    };

    const photosRes = await getPhotosAsync(getQueryParams);
    const photos = await photosRes.json();

    let res = await getPhotoCategoriesAsync();
    let categories = await res.json();
    categories.items = [{ _id: "", slug: "", name: "All" }, ...categories.items];

    return {
      photos: photos.items,
      currentPage: page,
      totalPhotosCount: photos.total,
      initialSearchProp: search,
      categories: categories.items,
    };
  }

  state = {
    searchText: "",
    photos: [],
    totalPhotosCount: 0,
    currentPage: 1,
    categories: [],
    currentCategory: null,
    fullScreenPhotoVisible: false,
    fullScreenPhotoSource: "",
  };

  componentDidMount() {
    const { photos, categories, currentPage, totalPhotosCount, initialSearchProp } = this.props;

    //Get the current category
    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];

    this.setState({ currentCategory: currentCategory });
    this.setState({ photos: photos });
    this.setState({ currentPage: currentPage });
    this.setState({ totalPhotosCount: totalPhotosCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });
  }

  componentDidUpdate(prevProps, prevState) {
    const { photos, currentPage, categories, totalPhotosCount } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.photos !== photos) this.setState({ photos });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalPhotosCount !== totalPhotosCount) this.setState({ totalPhotosCount });

    //If there's a category in the query and it's different than the current category
    if (Router.query.category != currentCategory.slug) {
      let matchingCategory = categories.filter((c) => c.slug === Router.query.category)[0];
      matchingCategory = matchingCategory ? matchingCategory : categories.filter((c) => c._id === "")[0];
      if (prevState.currentCategory !== matchingCategory) this.setState({ currentCategory: matchingCategory });
    }
  }

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
    console.log(selectedItem);
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

  async handleRemovePhoto(article) {
    let { previews: originalPreviews, totalPhotosCount } = this.state;

    let res = null;
    try {
      res = await deletePhotoAsync(article._id);
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

    const previews = originalPreviews.filter((p) => p._id !== article._id);
    this.setState({ previews });
    this.setState({ totalPhotosCount: totalPhotosCount-- });
  }

  async handleRemoveCategory(category) {
    let res = null;
    try {
      res = await deletePhotoCategoryAsync(category._id);
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

  getClassesForPhoto(photo) {
    const displaySizeWithFirstCharUppercase = photo.displaySize.charAt(0).toUpperCase() + photo.displaySize.slice(1);
    const photoClassName = photo.orientation + displaySizeWithFirstCharUppercase;

    if (photoClassName in photoStyles) return photoStyles[photoClassName];
    else {
      console.error("Coudn't find appropriate photo class for orientation and displaySize");
      return photoStyles.landscapeMedium;
    }
  }

  handleOpenFullScreenPhoto(source) {
    this.setState({ fullScreenPhotoSource: source });
    this.setState({ fullScreenPhotoVisible: true });
  }

  handleCloseFullScreenPhoto(source) {
    this.setState({ fullScreenPhotoSource: "" });
    this.setState({ fullScreenPhotoVisible: false });
  }

  getEmptyPhotoSectionMarkup() {
    const { mainContentType } = this.props;

    return (
      <div style={{ textAlign: "center" }}>
        <h1>{`No ${mainContentType}s found.`}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/director_sad.svg"></object>
        </div>
      </div>
    );
  }

  render() {
    const { photos, fullScreenPhotoVisible, fullScreenPhotoSource, searchText, categories, currentCategory } = this.state;
    const { user } = this.props;

    //If we have no articles to display for this route...
    let markupBody;
    if (!photos || photos.length === 0) markupBody = this.getEmptyPhotoSectionMarkup();
    else
      markupBody = (
        <div>
          <div style={{ zIndex: "200" }} className={photoStyles.container}>
            {photos.map((photo) => (
              <div
                key={photo._id}
                title={`Orientation: ${photo.orientation}, DisplaySize: ${photo.displaySize}`}
                className={this.getClassesForPhoto(photo)}
              >
                <img
                  onClick={() => this.handleOpenFullScreenPhoto(photo.source)}
                  className={photoStyles.containerFitImage}
                  src={photo.source}
                />
              </div>
            ))}
            <FullscreenPhoto
              onCloseRequested={() => this.handleCloseFullScreenPhoto()}
              visible={fullScreenPhotoVisible}
              src={fullScreenPhotoSource}
            />
          </div>
        </div>
      );

    return (
      <Layout user={user}>
        <CommonPageHeaderControls
          user={user}
          mainPagePath="showcase/photo"
          mainContentType="photo"
          searchText={searchText}
          onSearchTextChanged={(searchText) => this.setState({ searchText })}
          onSearch={() => this.handleSearch()}
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={(category) => this.handleCategoryChange(category)}
          onDeleteCategoryAsync={async (category) => this.handleRemoveCategory(category)}
        />
        {markupBody}
      </Layout>
    );
  }
}

export default withAuthAsync(Photo);
