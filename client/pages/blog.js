import Layout from "../components/layout";
import { getBlogsAsync, deleteBlogAsync, getBlogCategoriesAsync, deleteBlogCategoryAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import Pagination from "../components/common/pagination";
import Link from "next/link";
import Router from "next/router";
import Icon from "../components/common/icon";
import TransparentButton from "../components/common/transparentButton";
import BasicButton from "../components/common/basicButton";
import { Component } from "react";
import withAuthAsync from "../components/common/withAuthAsync";
import { toast } from "react-toastify";
import CommonPageHeaderControls from "../components/common/commonPageHeaderControls";

const pageSize = 6;

const RemoveArticleToast = ({ closeToast, article, onRemoveArticle }) => (
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={() => onRemoveArticle(article)}>Remove</BasicButton>
  </div>
);

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
    console.log("unmounting");
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  componentDidMount() {
    console.log("mounted baby");

    const { previews, categories, currentPage, totalBlogsCount, initialSearchProp } = this.props;
    this.setState({ previews: previews });
    this.setState({ currentPage: currentPage });
    this.setState({ totalBlogsCount: totalBlogsCount });
    this.setState({ initialSearchProp: initialSearchProp });
    this.setState({ categories: categories });

    let currentCategory = categories.filter((c) => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter((c) => c._id === "")[0];
    this.setState({ currentCategory: currentCategory });
  }

  componentDidUpdate(prevProps, prevState) {
    //If the search query changes..
    console.log(prevProps);

    console.log("updated");
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

    const originalPreviews = this.state.previews;
    const previews = originalPreviews.filter((p) => p._id !== article._id);
    this.setState({ previews });
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
    const { previews, categories, currentPage, totalBlogsCount, currentCategory } = this.state;
    const { user } = this.props;
    let searchText = "";
    searchText = this.state.searchText;

    console.log("current page", currentPage, "total blogs", totalBlogsCount);
    console.log("current category", currentCategory);

    let view = (
      <div style={{ textAlign: "center" }}>
        <h1>No blogs found</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="director_sad.svg"></object>
        </div>
      </div>
    );

    if (previews && previews.length > 0) {
      view = (
        <div>
          <div className={blogStyles.container}>
            {previews.map((preview) => (
              <div key={preview._id} className={blogStyles.item}>
                {/*Admin Controls*/}
                {user && user.isAdmin && (
                  <div className={blogStyles.adminOptions}>
                    {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
                    <a href={`/blog/edit/article/${preview._id}`}>
                      <TransparentButton style={{ color: "var(--f1)" }}>
                        <Icon className="fas fa-edit"></Icon>
                      </TransparentButton>
                    </a>

                    <TransparentButton
                      onClick={() =>
                        toast.info(
                          <RemoveArticleToast article={preview} onRemoveArticle={async (article) => this.handleRemoveArticle(article)} />
                        )
                      }
                      style={{ color: "var(--f1)" }}
                    >
                      <Icon className="fas fa-trash"></Icon>
                    </TransparentButton>
                  </div>
                )}

                <div className={blogStyles.previewTitle}>
                  <Link href="/blog/[slug]" as={`/blog/${preview.slug}`}>
                    <a className="clickableHeading">{preview.title}</a>
                  </Link>
                </div>
                <div className={blogStyles.previewImage}>
                  <Link href="/blog/[slug]" as={`/blog/${preview.slug}`}>
                    <a>
                      <img className={blogStyles.containerFitImage} src={preview.image} />
                    </a>
                  </Link>
                </div>
                <div className={blogStyles.description}>
                  <label>{preview.description}</label>
                </div>
              </div>
            ))}
          </div>
          <div className={blogStyles.paginationContainer}>
            <Pagination itemsCount={totalBlogsCount} pageSize={pageSize} currentPage={currentPage} />
          </div>
        </div>
      );
    }

    console.log(user);
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
          onCategoryChange={(category) => this.handleCategoryChange(category)}
          onDeleteCategoryAsync={async (category) => this.handleRemoveCategory(category)}
        />
        <div>{view}</div>
      </Layout>
    );
  }
}

export default withAuthAsync(Blog);
