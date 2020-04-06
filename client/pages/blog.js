import Layout from "../components/layout";
import { getBlogsAsync, getBlogCategoriesAsync, deleteBlogAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import Select from "../components/common/select";
import Pagination from "../components/common/pagination";
import Link from "next/link";
import Router from "next/router";
import Icon from "../components/common/icon";
import TransparentButton from "../components/common/transparentButton";
import BasicButton from "../components/common/basicButton";
import { Component } from "react";
import withAuthAsync from "../components/common/withAuthAsync";
import { toast } from 'react-toastify';

const pageSize = 6;

const RemoveArticleToast = ({closeToast, article, onRemoveArticle}) =>(
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={()=> onRemoveArticle(article)}>Remove</BasicButton>
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
    this.setState({ currentCategory: currentCategory });
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

  async handleRemoveArticle(article){
      let res = null;
      try{
        res = await deleteBlogAsync(article._id);
      }
      catch(ex){
          let errorMessage = `Error: ${ex}`;
          console.log(errorMessage);
          toast.error(errorMessage);
          return;
      }
      if(!res.ok){
          let body = "";
          //TODO: Parse Text OR JSON
          body = await res.text(); 
          let errorMessage = `Error: ${res.status} - ${body}`;
          console.log(errorMessage)
          toast.error(errorMessage);    
          return;
      }

      const originalPreviews = this.state.previews;
      const previews = originalPreviews.filter(p => p._id !== article._id);   
      this.setState({ previews });
  }

  render() {
    const { previews, categories, currentPage, totalBlogsCount, currentCategory, initialSearchProp } = this.state;
    const { user } =this.props;
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

                {/*Admin Controls*/}
                {user && user.isAdmin &&                
                <div className={blogStyles.adminOptions}>
                  <TransparentButton style={{ color: "var(--f1)" }}>
                    <Icon className="fas fa-edit"></Icon>
                    </TransparentButton>
                  <TransparentButton onClick={() => toast.info(<RemoveArticleToast article={preview} onRemoveArticle={async (article) => this.handleRemoveArticle(article)} />)} style={{ color: "var(--f1)" }}>
                    <Icon className="fas fa-trash"></Icon>
                  </TransparentButton>
                </div>}

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
      <Layout user ={user}>
        {/* Search and Category */}
        <div className={blogStyles.headerControlsContainer}>
          <div className={blogStyles.headerControl}>
            <input
              style={{ width: "100%" }}
              className="form-control"
              onKeyPress={e => this.handleSearchKeyPress(e)}
              value={searchText}
              onChange={e => this.handleSearchTextChanged(e.target.value)}
              placeholder="Search..."
            />
          </div>

          <div className={blogStyles.headerControl}>
            <Select
              style={{ width: "100%" }}
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

export default withAuthAsync(Blog)