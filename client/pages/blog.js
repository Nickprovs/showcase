import { Component } from "react";
import { toast } from "react-toastify";
import withAuthAsync from "../components/common/withAuthAsync";
import Layout from "../components/layout";
import CommonPageHeaderControls from "../components/common/commonPageHeaderControls";
import CommonPageArticleSection from "../components/common/commonPageArticleSection";
import Router from "next/router";
import { getBlogsAsync, deleteBlogAsync, getBlogCategoriesAsync, deleteBlogCategoryAsync } from "../services/blogService";

const pageSize = 6;

class Blog extends Component {
  static async getInitialProps(context) {
    let pageQueryParam = context.query.page ? parseInt(context.query.page) : 1;
    let searchQueryParam = context.query.search ? context.query.search : "";
    let categoryQueryParam = context.query.category ? context.query.category : "";

    const options = {
      page: pageQueryParam,
      search: searchQueryParam,
      category: categoryQueryParam,
    };

    return await Blog.getBlogData(options);
  }

  static async getBlogData(options) {
    let page = options.page ? options.page : 1;
    let search = options.search ? options.search : "";
    let category = options.category ? options.category : "";

    const getQueryParams = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      search: search,
      category: category,
    };

    const blogsRes = await getBlogsAsync(getQueryParams);
    const blogs = await blogsRes.json();

    let res = await getBlogCategoriesAsync();
    let categories = await res.json();
    categories.items = [{ _id: "", slug: "", name: "All" }, ...categories.items];

    return {
      previews: blogs.items,
      currentPage: page,
      totalBlogsCount: blogs.total,
      initialSearchProp: search,
      categories: categories.items,
    };
  }

  state = {
    searchText: "",
    previews: [],
    totalBlogsCount: 0,
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
    const { previews, categories, currentPage, totalBlogsCount, initialSearchProp } = this.props;

    //Get the current category
    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];

    this.setState({ currentCategory: currentCategory });
    this.setState({ previews: previews });
    this.setState({ currentPage: currentPage });
    this.setState({ totalBlogsCount: totalBlogsCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });
  }

  componentDidUpdate(prevProps, prevState) {
    const { previews, currentPage, categories, totalBlogsCount } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.previews !== previews) this.setState({ previews });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalBlogsCount !== totalBlogsCount) this.setState({ totalBlogsCount });

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
    let { previews: originalPreviews, totalBlogsCount } = this.state;

    let res = null;
    try {
      res = await deleteBlogAsync(article._id);
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
    this.setState({ totalBlogsCount: totalBlogsCount-- });
  }

  async handleRemoveCategory(category) {
    let res = null;
    try {
      res = await deleteBlogCategoryAsync(category._id);
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

  render() {
    const { previews, categories, currentPage, totalBlogsCount, currentCategory, searchText } = this.state;
    const { user } = this.props;

    return (
      <Layout user={user}>
        <CommonPageHeaderControls
          user={user}
          mainPagePath="blog"
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
          mainPagePath="blog"
          previews={previews}
          onRemoveArticleAsync={async (article) => await this.handleRemoveArticle(article)}
          currentPage={currentPage}
          totalBlogsCount={totalBlogsCount}
          pageSize={pageSize}
        />
      </Layout>
    );
  }
}

export default withAuthAsync(Blog);
