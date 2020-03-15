import Layout from "../components/layout";
import { getBlogsAsync, getBlogCategoriesAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import FormTextInput from "../components/common/formTextInput";
import FormSelectInput from "../components/common/formSelectInput";
import Pagination from "../components/common/pagination";
import Link from "next/link";
import Router from "next/router";
import { Component } from "react";

const pageSize = 6;

export default class Blog extends Component {
  static async getInitialProps(context) {
    let pageQueryParam = context.query.page ? parseInt(context.query.page) : 1;
    let searchQueryParam = context.query.search ? context.query.search : "";
    let categoryQueryParam = context.query.category ? context.query.category : "";

    const options = {
      page: pageQueryParam,
      search: searchQueryParam,
      category: categoryQueryParam
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
      category: category
    };

    const blogs = await getBlogsAsync(getQueryParams);
    let categories = await getBlogCategoriesAsync();
    categories.items = [{ _id: "", slug: "", name: "All" }, ...categories.items];

    return {
      previews: blogs.items,
      currentPage: page,
      totalBlogsCount: blogs.total,
      initialSearchProp: search,
      categories: categories.items
    };
  }

  constructor(props) {
    super(props);
    console.log("constructed");
    console.log(this.props.initialSearchProp);
    this.state.searchText = this.props.initialSearchProp;
    this.handleSearchTextChanged = this.handleSearchTextChanged.bind(this);
    this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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

    let currentCategory = categories.filter(c => c.slug === Router.query.category)[0];
    currentCategory = currentCategory ? currentCategory : categories.filter(c => c._id === "")[0];
    console.log("current category", currentCategory);
    this.setState({ currentCategory: currentCategory });

    setTimeout(() => this.setState({ previews: this.state.previews.filter(i => !i.title.toLowerCase().includes("hozier")) }), 3000);
  }

  state = {
    searchText: ""
  };

  componentDidUpdate(prevProps, prevState) {
    //If the search query changes..
    console.log(prevProps);

    console.log("updated");
    const { previews, currentPage, categories, totalBlogsCount, initialSearchProp } = this.props;
    const { currentCategory } = this.state;

    if (prevProps.previews !== previews) this.setState({ previews });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalBlogsCount !== totalBlogsCount) this.setState({ totalBlogsCount });
    if (prevProps.initialSearchProp !== initialSearchProp) this.setState({ initialSearchProp });

    //If there's a category in the query and it's different than the current category
    if (Router.query.category != currentCategory.slug) {
      let matchingCategory = categories.filter(c => c.slug === Router.query.category)[0];
      matchingCategory = matchingCategory ? matchingCategory : categories.filter(c => c._id === "")[0];
      if (prevState.currentCategory !== matchingCategory) this.setState({ currentCategory: matchingCategory });
    }
  }

  handleSearchKeyPress(e) {
    console.log("key", e.key);
    if (e.key != "Enter") return;
    e.target.blur();

    this.handleSearch();
  }

  handleSearchTextChanged(text) {
    this.setState({ searchText: text });
    this.unrenderedSearchTextChange = true;
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(this.handleSearch, 700);
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
      query: { ...searchQuery, ...previousQuery }
    };
    Router.push(url, url, { shallow: false });
  }

  handleCategoryChange(selectedIndex) {
    const category = this.state.categories[selectedIndex];
    if (category.slug === Router.query.category) return;

    let previousQuery = { ...Router.query };
    delete previousQuery.category;
    delete previousQuery.page;

    let categoryQuery = {};
    if (category._id) categoryQuery = { category: category.slug };

    const url = {
      pathname: Router.pathname,
      query: { ...categoryQuery, ...previousQuery }
    };
    Router.push(url, url, { shallow: false });
  }

  render() {
    const { previews, categories, currentPage, totalBlogsCount, currentCategory, initialSearchProp } = this.state;
    let searchText = "";
    searchText = this.state.searchText;

    console.log("current page", currentPage, "total blogs", totalBlogsCount);

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
            {previews.map(preview => (
              <div key={preview._id} className={blogStyles.item}>
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

    return (
      <Layout>
        {/* Search and Category */}
        <div style={{ display: "flex", flex: "5em 25em", flexDirection: "row", alignItems: "center", justifyContent: "start" }}>
          <div style={{ marginLeft: "20px" }}>
            <FormTextInput
              onKeyPress={e => this.handleSearchKeyPress(e)}
              value={searchText}
              onChange={e => this.handleSearchTextChanged(e.target.value)}
              placeholder="Search..."
            />
          </div>

          <div style={{ marginLeft: "20px" }}>
            <FormSelectInput
              value={currentCategory ? currentCategory.name : "All"}
              onChange={e => this.handleCategoryChange(e.target.selectedIndex)}
              children={categories}
              path={"name"}
            />
          </div>
        </div>

        {/* Main View */}
        <div>{view}</div>
      </Layout>
    );
  }
}
