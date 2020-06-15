import { Component } from "react";
import photoStyles from "../../styles/page/photo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import FullscreenPhoto from "../../components/common/photo/fullscreenPhoto";
import withAuthAsync from "../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../components/common/hoc/withLayoutAsync";
import { getPhotosAsync, deletePhotoAsync, getPhotoCategoriesAsync, deletePhotoCategoryAsync } from "../../services/photoService";
import { getFeaturedSubsidiariesAsync, createFeaturedSubsidiaryAsync, deleteFeaturedSubsidiaryAsync } from "../../services/featuredService";
import Router from "next/router";
import CommonPageHeaderControls from "../../components/page/common/commonPageHeaderControls";
import Link from "next/link";
import TransparentButton from "../../components/common/button/transparentButton";
import BasicButton from "../../components/common/button/basicButton";
import Pagination from "../../components/common/misc/pagination";
import { toast } from "react-toastify";
import Head from "next/head";
import FormatUtilities from "../../util/formatUtilities";

const pageSize = 10;

const RemovePhotoToast = ({ closeToast, photo, onRemovePhotoAsync }) => (
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={async () => await onRemovePhotoAsync(photo)}>Remove</BasicButton>
  </div>
);

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
    let page = parseInt(options.page) && parseInt(options.page) >= 1 ? parseInt(options.page) : 1;
    let search = options.search ? options.search : "";
    let category = options.category ? options.category : "";

    const getQueryParams = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search: search,
      category: category,
    };

    let photosRes = await getPhotosAsync(getQueryParams);
    if (!photosRes.ok) {
      (getQueryParams.category = ""), (getQueryParams.search = "");
      photosRes = await getPhotosAsync(getQueryParams);
    }
    const photos = await photosRes.json();

    const featuredRes = await getFeaturedSubsidiariesAsync({ scope: "verbatim" });
    const featured = await featuredRes.json();

    let res = await getPhotoCategoriesAsync();
    let categories = await res.json();
    categories.items = [{ _id: "", slug: "", name: "All" }, ...categories.items];

    return {
      photos: photos.items,
      featured: featured,
      currentPage: page,
      totalPhotosCount: photos.total,
      initialSearchProp: search,
      categories: categories.items,
    };
  }

  state = {
    searchText: "",
    photos: [],
    featured: null,
    totalPhotosCount: 0,
    currentPage: 1,
    categories: [],
    currentCategory: null,
    fullScreenPhotoVisible: false,
    fullScreenPhoto: null,
  };

  componentDidMount() {
    const { photos, featured, categories, currentPage, totalPhotosCount, initialSearchProp } = this.props;

    //Get the current category
    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];

    this.setState({ currentCategory: currentCategory });
    this.setState({ photos: photos });
    this.setState({ featured: featured });
    this.setState({ currentPage: currentPage });
    this.setState({ totalPhotosCount: totalPhotosCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });
  }

  componentDidUpdate(prevProps, prevState) {
    const { photos, featured, currentPage, categories, totalPhotosCount, initialSearchProp } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.featured !== featured) this.setState({ featured });
    if (prevProps.photos !== photos) this.setState({ photos });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalPhotosCount !== totalPhotosCount) this.setState({ totalPhotosCount });
    if (prevProps.initialSearchProp !== initialSearchProp) {
      this.setState({ searchText: initialSearchProp });
      this.setState({ initialSearchProp });
    }

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

  async handleRemovePhoto(photo) {
    let { photos: originalPhotos, totalPhotosCount } = this.state;

    let res = null;
    try {
      res = await deletePhotoAsync(photo._id);
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

    const photos = originalPhotos.filter((p) => p._id !== photo._id);
    this.setState({ photos });
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

  async handleToggleFeaturedPhoto(photo) {
    const { featured: originalFeatured } = this.state;
    let res = null;
    try {
      let sameItemAlreadyFeatured = originalFeatured.subsidiaries.items.find((item) => item.id === photo._id);
      if (sameItemAlreadyFeatured) {
        res = await deleteFeaturedSubsidiaryAsync(photo._id);
        let originalFeaturedWithRemovedItem = { ...originalFeatured };
        originalFeaturedWithRemovedItem.subsidiaries.items.splice(originalFeatured.subsidiaries.items.indexOf(sameItemAlreadyFeatured), 1);
        console.log(originalFeaturedWithRemovedItem);
        this.setState({ featured: originalFeaturedWithRemovedItem });
      } else {
        res = await createFeaturedSubsidiaryAsync({ id: photo._id, type: "photo" });
        let featuredPhotoRes = await res.json();
        console.log("res", featuredPhotoRes);
        let originalFeaturedWithAddedItem = { ...originalFeatured };
        originalFeaturedWithAddedItem.subsidiaries.items.push(featuredPhotoRes);
        this.setState({ featured: originalFeaturedWithAddedItem });
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

  getClassesForPhoto(photo) {
    const displaySizeWithFirstCharUppercase = photo.displaySize.charAt(0).toUpperCase() + photo.displaySize.slice(1);
    const photoClassName = photo.orientation + displaySizeWithFirstCharUppercase;

    if (photoClassName in photoStyles) return photoStyles[photoClassName];
    else {
      console.error("Coudn't find appropriate photo class for orientation and displaySize");
      return photoStyles.landscapeMedium;
    }
  }

  handleOpenFullScreenPhoto(photo) {
    this.setState({ fullScreenPhoto: photo });
    this.setState({ fullScreenPhotoVisible: true });
  }

  handleCloseFullScreenPhoto() {
    this.setState({ fullScreenPhoto: "" });
    this.setState({ fullScreenPhotoVisible: false });
  }

  getEmptyPhotoSectionMarkup() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>{`No photos found.`}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/images/director_sad.svg"></object>
        </div>
      </div>
    );
  }

  render() {
    const { photos, featured, totalPhotosCount, fullScreenPhotoVisible, fullScreenPhoto, searchText, categories, currentCategory, currentPage } = this.state;
    const { user, general } = this.props;

    //If we have no photos to display for this route...
    let markupBody;
    if (!photos || photos.length === 0) markupBody = this.getEmptyPhotoSectionMarkup();
    else
      markupBody = (
        <div>
          <Head>
            <title>{FormatUtilities.getFormattedWebsiteTitle("Photo", general ? general.title : "Showcase")}</title>
          </Head>
          <div style={{ zIndex: "200" }} className={photoStyles.container}>
            {photos.map((photo) => (
              <div
                key={photo._id}
                title={`Orientation: ${photo.orientation}, DisplaySize: ${photo.displaySize}`}
                className={this.getClassesForPhoto(photo)}
                style={{ position: "relative" }}
              >
                <div className={photoStyles.cellContainer}>
                  {/* Admin Options */}
                  {user && user.isAdmin && (
                    <div id="test" className={photoStyles.adminOptions}>
                      <div style={{ backgroundColor: "white" }}>
                        <TransparentButton onClick={async () => await this.handleToggleFeaturedPhoto(photo)} style={{ color: "var(--f1)" }}>
                          <FontAwesomeIcon size="2x" icon={featured.subsidiaries.items.some((item) => item.id === photo._id) ? fasStar : farStar} />
                        </TransparentButton>
                        <Link href={`/showcase/photo/edit/photo/[id]`} as={`/showcase/photo/edit/photo/${photo._id}`}>
                          <a>
                            <TransparentButton>
                              <FontAwesomeIcon size="2x" icon={faEdit} />
                            </TransparentButton>
                          </a>
                        </Link>

                        <TransparentButton
                          onClick={() =>
                            toast.info(<RemovePhotoToast photo={photo} onRemovePhotoAsync={async (photo) => await this.handleRemovePhoto(photo)} />)
                          }
                          style={{ color: "var(--f1)" }}
                        >
                          <FontAwesomeIcon size="2x" icon={faTrash} />
                        </TransparentButton>
                      </div>
                    </div>
                  )}

                  <img className={photoStyles.containerFitImage} onClick={() => this.handleOpenFullScreenPhoto(photo)} src={photo.source} />
                </div>
              </div>
            ))}
            <FullscreenPhoto
              onCloseRequested={() => this.handleCloseFullScreenPhoto()}
              visible={fullScreenPhotoVisible}
              src={fullScreenPhoto ? fullScreenPhoto.source : ""}
              metadata={fullScreenPhoto}
            />
          </div>
        </div>
      );

    return (
      <div>
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
        <div className={photoStyles.paginationContainer}>
          <Pagination itemsCount={totalPhotosCount} pageSize={pageSize} currentPage={currentPage} />
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Photo));
