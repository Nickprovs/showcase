import mediaStyles from "../../styles/media.module.css";
import withAuthAsync from "../../components/common/withAuthAsync";
import withLayoutAsync from "../../components/common/withLayoutAsync";
import { Component } from "react";
import { getMediasAsync, deleteMediaAsync, getMediaCategoriesAsync } from "../../services/mediaService";
import { getFeaturedSubsidiariesAsync, createFeaturedSubsidiaryAsync, deleteFeaturedSubsidiaryAsync } from "../../services/featuredService";
import CommonPageHeaderControls from "../../components/common/commonPageHeaderControls";
import Router from "next/router";
import Icon from "../../components/common/icon";
import TransparentButton from "../../components/common/transparentButton";
import BasicButton from "../../components/common/basicButton";
import Pagination from "../../components/common/pagination";
import DangerousInnerHtmlWithScript from "../../components/common/dangerousInnerHtmlWithScript";
import EmbedUtilities from "../../util/embedUtilities";

import { toast } from "react-toastify";
import reframe from "reframe.js";

const pageSize = 5;

const RemoveMediaToast = ({ closeToast, media, onRemoveMediaAsync }) => (
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={async () => await onRemoveMediaAsync(media)}>Remove</BasicButton>
  </div>
);

class Media extends Component {
  static async getInitialProps(context) {
    let pageQueryParam = context.query.page ? parseInt(context.query.page) : 1;
    let searchQueryParam = context.query.search ? context.query.search : "";
    let categoryQueryParam = context.query.category ? context.query.category : "";

    const options = {
      page: pageQueryParam,
      search: searchQueryParam,
      category: categoryQueryParam,
    };

    return await Media.getMediaData(options);
  }

  static async getMediaData(options) {
    let page = options.page ? options.page : 1;
    let search = options.search ? options.search : "";
    let category = options.category ? options.category : "";

    const getQueryParams = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search: search,
      category: category,
    };

    const mediasRes = await getMediasAsync(getQueryParams);
    const medias = await mediasRes.json();

    const featuredRes = await getFeaturedSubsidiariesAsync({ scope: "verbatim" });
    const featured = await featuredRes.json();

    let res = await getMediaCategoriesAsync();
    let categories = await res.json();
    categories.items = [{ _id: "", slug: "", name: "All" }, ...categories.items];

    return {
      medias: medias.items,
      featured: featured,
      currentPage: page,
      totalMediasCount: medias.total,
      initialSearchProp: search,
      categories: categories.items,
    };
  }

  constructor(props) {
    super(props);
    this.mediaContainerRefs = [];
    this.state.searchText = this.props.initialSearchProp;
  }

  state = {
    searchText: "",
    medias: [],
    featured: null,
    totalMediasCount: 0,
    currentPage: 1,
    categories: [],
    currentCategory: null,
  };

  componentDidMount() {
    const { medias, featured, categories, currentPage, totalMediasCount, initialSearchProp } = this.props;

    //Get the current category
    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];

    this.setState({ currentCategory: currentCategory });
    this.setState({ medias: medias });
    this.setState({ featured: featured });
    this.setState({ currentPage: currentPage });
    this.setState({ totalMediasCount: totalMediasCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });
  }

  componentDidUpdate(prevProps, prevState) {
    const { medias, featured, currentPage, categories, totalMediasCount } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.featured !== featured) this.setState({ featured });
    if (prevProps.medias !== medias) this.setState({ medias });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalMediasCount !== totalMediasCount) this.setState({ totalMediasCount });

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

  setMediaContainerRefs = (ref) => {
    this.mediaContainerRefs.push(ref);
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

  async handleRemoveMedia(media) {
    let { medias: originalMedias, totalMediasCount } = this.state;

    let res = null;
    try {
      res = await deleteMediaAsync(media._id);
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

    const medias = originalMedias.filter((p) => p._id !== media._id);
    this.setState({ medias });
    this.setState({ totalMediasCount: totalMediasCount-- });
  }

  async handleRemoveCategory(category) {
    let res = null;
    try {
      res = await deleteMediaCategoryAsync(category._id);
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

  async handleToggleFeaturedMedia(media) {
    const { featured: originalFeatured } = this.state;
    let res = null;
    try {
      let sameItemAlreadyFeatured = originalFeatured.subsidiaries.items.find((item) => item.id === media._id);
      if (sameItemAlreadyFeatured) {
        res = await deleteFeaturedSubsidiaryAsync(media._id);
        let originalFeaturedWithRemovedItem = { ...originalFeatured };
        originalFeaturedWithRemovedItem.subsidiaries.items.splice(originalFeatured.subsidiaries.items.indexOf(sameItemAlreadyFeatured), 1);
        console.log(originalFeaturedWithRemovedItem);
        this.setState({ featured: originalFeaturedWithRemovedItem });
      } else {
        res = await createFeaturedSubsidiaryAsync({ id: media._id, type: "media" });
        let featuredMediaRes = await res.json();
        console.log("res", featuredMediaRes);
        let originalFeaturedWithAddedItem = { ...originalFeatured };
        originalFeaturedWithAddedItem.subsidiaries.items.push(featuredMediaRes);
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

  getEmptyMediaSectionMarkup() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>{`No medias found.`}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/director_sad.svg"></object>
        </div>
      </div>
    );
  }

  render() {
    const { user } = this.props;
    const { medias, featured, totalMediasCount, currentPage, searchText, categories, currentCategory } = this.state;

    //If we have no medias to display for this route...
    let markupBody;
    if (!medias || medias.length === 0) markupBody = this.getEmptyMediaSectionMarkup();
    else {
      markupBody = (
        <div className={mediaStyles.container}>
          {medias.map((media, i) => (
            <div key={media._id} className={mediaStyles.item}>
              {/*Admin Controls*/}
              {user && user.isAdmin && (
                <div className={mediaStyles.adminOptions}>
                  <TransparentButton onClick={async () => await this.handleToggleFeaturedMedia(media)} style={{ color: "var(--f1)" }}>
                    <Icon
                      className={featured.subsidiaries.items.some((item) => item.id === media._id) ? "fas fa-star" : "far fa-star"}
                    ></Icon>
                  </TransparentButton>
                  {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
                  <a href={`media/edit/media/${media._id}`}>
                    <TransparentButton style={{ color: "var(--f1)" }}>
                      <Icon className="fas fa-edit"></Icon>
                    </TransparentButton>
                  </a>

                  <TransparentButton
                    onClick={() =>
                      toast.info(
                        <RemoveMediaToast media={media} onRemoveMediaAsync={async (media) => await this.handleRemoveMedia(media)} />
                      )
                    }
                    style={{ color: "var(--f1)" }}
                  >
                    <Icon className="fas fa-trash"></Icon>
                  </TransparentButton>
                </div>
              )}

              <div className={mediaStyles.title}>
                <h2>{media.title.toUpperCase()}</h2>
              </div>
              {/*TODO: Changed to iFrame or Media Tag*/}
              <DangerousInnerHtmlWithScript className={mediaStyles.mediaContainer} html={media.markup} />
              <div className={mediaStyles.descriptionContainer}>
                <label>{media.description}</label>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <CommonPageHeaderControls
          user={user}
          mainPagePath="showcase/media"
          mainContentType="media"
          searchText={searchText}
          onSearchTextChanged={(searchText) => this.setState({ searchText })}
          onSearch={() => this.handleSearch()}
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={(category) => this.handleCategoryChange(category)}
          onDeleteCategoryAsync={async (category) => this.handleRemoveCategory(category)}
        />
        {markupBody}
        <div className={mediaStyles.paginationContainer}>
          <Pagination itemsCount={totalMediasCount} pageSize={pageSize} currentPage={currentPage} />
        </div>
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Media));
