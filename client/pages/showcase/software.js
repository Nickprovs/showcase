import { Component } from "react";
import { toast } from "react-toastify";
import withAuthAsync from "../../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../../components/common/hoc/withLayoutAsync";
import CommonPageHeaderControls from "../../components/page/common/commonPageHeaderControls";
import CommonPageArticleSection from "../../components/page/common/commonPageArticleSection";
import Router from "next/router";
import { getSoftwaresAsync, deleteSoftwareAsync, getSoftwareCategoriesAsync, deleteSoftwareCategoryAsync } from "../../services/softwareService";
import { getFeaturedSubsidiariesAsync, createFeaturedSubsidiaryAsync, deleteFeaturedSubsidiaryAsync } from "../../services/featuredService";
import Head from "next/head";
import FormatUtilities from "../../util/formatUtilities";
import StringUtilities from "../../util/stringUtilities";

const pageSize = 6;

class Software extends Component {
  static async getInitialProps(context) {
    let pageQueryParam = context.query.page ? parseInt(context.query.page) : 1;
    let searchQueryParam = context.query.search ? context.query.search : "";
    let categoryQueryParam = context.query.category ? context.query.category : "";

    const options = {
      page: pageQueryParam,
      search: searchQueryParam,
      category: categoryQueryParam,
    };

    return await Software.getSoftwareData(options);
  }

  static async getSoftwareData(options) {
    let page = parseInt(options.page) && parseInt(options.page) >= 1 ? parseInt(options.page) : 1;
    let search = options.search ? options.search : "";
    let category = options.category ? options.category : "";

    const getQueryParams = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search: search,
      category: category,
    };

    let softwareRes = await getSoftwaresAsync(getQueryParams);
    if (!softwareRes.ok) {
      (getQueryParams.category = ""), (getQueryParams.search = "");
      softwareRes = await getSoftwaresAsync(getQueryParams);
    }
    const software = await softwareRes.json();

    const featuredRes = await getFeaturedSubsidiariesAsync({ scope: "verbatim" });
    const featured = await featuredRes.json();

    let res = await getSoftwareCategoriesAsync();
    let categories = await res.json();
    categories.items = [{ _id: "", slug: "", name: "All" }, ...categories.items];

    return {
      previews: software.items,
      featured: featured,
      currentPage: page,
      totalSoftwaresCount: software.total,
      initialSearchProp: search,
      categories: categories.items,
    };
  }

  state = {
    searchText: "",
    previews: [],
    featured: null,
    totalSoftwaresCount: 0,
    currentPage: 1,
    categories: [],
    currentCategory: null,
  };

  constructor(props) {
    super(props);

    this.state.searchText = this.props.initialSearchProp;

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
    this.handleRemoveArticle = this.handleRemoveArticle.bind(this);
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  componentDidMount() {
    const { previews, featured, categories, currentPage, totalSoftwaresCount, initialSearchProp } = this.props;

    //Get the current category
    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];

    this.setState({ currentCategory: currentCategory });
    this.setState({ previews: previews });
    this.setState({ featured: featured });
    this.setState({ currentPage: currentPage });
    this.setState({ totalSoftwaresCount: totalSoftwaresCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });
  }

  componentDidUpdate(prevProps, prevState) {
    const { previews, featured, currentPage, categories, totalSoftwaresCount, initialSearchProp } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.featured !== featured) this.setState({ featured });
    if (prevProps.previews !== previews) this.setState({ previews });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalSoftwaresCount !== totalSoftwaresCount) this.setState({ totalSoftwaresCount });
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

  async handleRemoveArticle(article) {
    let { previews: originalPreviews, totalSoftwaresCount } = this.state;

    let res = null;
    try {
      res = await deleteSoftwareAsync(article._id);
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
    this.setState({ totalSoftwaresCount: totalSoftwaresCount-- });
  }

  async handleRemoveCategory(category) {
    let res = null;
    try {
      res = await deleteSoftwareCategoryAsync(category._id);
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

  async handleToggleFeaturedArticle(article) {
    const { featured: originalFeatured } = this.state;
    let res = null;
    try {
      let sameItemAlreadyFeatured = originalFeatured.subsidiaries.items.find((item) => item.id === article._id);
      if (sameItemAlreadyFeatured) {
        res = await deleteFeaturedSubsidiaryAsync(article._id);
        let originalFeaturedWithRemovedItem = { ...originalFeatured };
        originalFeaturedWithRemovedItem.subsidiaries.items.splice(originalFeatured.subsidiaries.items.indexOf(sameItemAlreadyFeatured), 1);
        console.log(originalFeaturedWithRemovedItem);
        this.setState({ featured: originalFeaturedWithRemovedItem });
      } else {
        res = await createFeaturedSubsidiaryAsync({ id: article._id, type: "software" });
        let featuredArticleRes = await res.json();
        console.log("res", featuredArticleRes);
        let originalFeaturedWithAddedItem = { ...originalFeatured };
        originalFeaturedWithAddedItem.subsidiaries.items.push(featuredArticleRes);
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

  render() {
    const { previews, featured, categories, currentPage, totalSoftwaresCount, currentCategory, searchText } = this.state;
    const { user, general, domainUrl } = this.props;

    return (
      <div>
        <Head>
          <meta property="og:title" content={FormatUtilities.getFormattedWebsiteTitle("Software", general ? general.title : "Showcase")} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`${domainUrl}/images/meta-profession.jpg`} />
          <meta property="og:description" content={`The software showcase of ${StringUtilities.toEachWordCapitalized(general.title)}.`} />
          <meta name="twitter:card" content="summary" />
          <title>{FormatUtilities.getFormattedWebsiteTitle("Software", general ? general.title : "Showcase")}</title>
          <meta name="description" content={`The software showcase of ${StringUtilities.toEachWordCapitalized(general.title)}.`} />
        </Head>
        <CommonPageHeaderControls
          user={user}
          mainPagePath="showcase/software"
          mainContentType="article"
          searchText={searchText}
          onSearchTextChanged={(searchText) => this.setState({ searchText })}
          onSearch={() => this.handleSearch()}
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={(category) => this.handleCategoryChange(category)}
          onDeleteCategoryAsync={async (category) => this.handleRemoveCategory(category)}
        />
        <CommonPageArticleSection
          user={user}
          mainPagePath="showcase/software"
          mainContentType="article"
          previews={previews}
          featured={featured}
          onRemoveArticleAsync={async (article) => await this.handleRemoveArticle(article)}
          onToggleFeaturedArticleAsync={async (article) => await this.handleToggleFeaturedArticle(article)}
          currentPage={currentPage}
          totalSoftwaresCount={totalSoftwaresCount}
          pageSize={pageSize}
        />
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Software));
