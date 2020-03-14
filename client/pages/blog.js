import Layout from "../components/layout";
import { getBlogsAsync, getBlogCategoriesAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import FormTextInput from "../components/common/formTextInput";
import Select from "../components/common/select";
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
    this.handleSearchFormSubmission = this.handleSearchFormSubmission.bind(this);
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

    setTimeout(() => this.setState({ previews: this.state.previews.filter(i => !i.title.toLowerCase().includes("hozier")) }), 3000);
  }

  state = {
    searchText: ""
  };

  componentDidUpdate(prevProps) {
    //If the search query changes..
    console.log(prevProps);

    console.log("updated");
    const { previews, currentPage, totalBlogsCount, initialSearchProp } = this.props;
    if (prevProps.previews !== previews) this.setState({ previews });
    if (prevProps.currentPage !== currentPage) this.setState({ currentPage });
    if (prevProps.totalBlogsCount !== totalBlogsCount) this.setState({ totalBlogsCount });
    if (prevProps.initialSearchProp !== initialSearchProp) this.setState({ initialSearchProp });
    // const { pathname, query } = this.props.router;
    // verify props have changed to avoid an infinite loop
    // if (query.search !== prevProps.router.query.search) {
    //   this.setState
    // }
  }

  handleSearchFormSubmission(e) {
    e.preventDefault();
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
    const { previews, categories, currentPage, totalBlogsCount, initialSearchProp } = this.state;
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
        <div>
          <form onSubmit={e => this.handleSearchFormSubmission(e)}>
            <FormTextInput
              value={searchText}
              onChange={e => this.handleSearchTextChanged(e.target.value)}
              placeholder="Search..."
              style={{ width: "30%", marginLeft: "20px" }}
            />
          </form>

          <Select
            onChange={e => this.handleCategoryChange(e.target.selectedIndex)}
            children={categories}
            path={"name"}
            style={{ width: "30%", marginLeft: "20px" }}
          />
        </div>

        {view}
      </Layout>
    );
  }
}
