import Layout from "../components/layout";
import { getBlogsAsync, deleteBlogAsync, getBlogCategoriesAsync, deleteBlogCategoryAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import Select, {components} from "react-select";
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

const RemoveCategoryToast = ({closeToast, category, onRemoveCategory}) =>(
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={()=> onRemoveCategory(category)}>Remove</BasicButton>
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
    this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
    this.handleRemoveArticle = this.handleRemoveArticle.bind(this);
    this.getCustomCategoryOptions = this.getCustomCategoryOptions.bind(this);
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

  handleCategoryChange(selectedItem) {
    const category = selectedItem.value;
    
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

  async handleRemoveCategory(category){
    let res = null;
    try{
      res = await deleteBlogCategoryAsync(category._id);
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

    const originalCategories = this.state.categories;
    const categories = originalCategories.filter(c => c._id !== category._id);   
    this.setState({ categories });
}

  getCustomCategoryOptions(props) {
    const {user} = this.props;

    return (
      <components.Option {...props}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          {props.data.label}
          {user && user.isAdmin && (
            <div>
              {/* Edit */}
              <Link href="/blog/edit/category/[id]" as={`/blog/edit/category/${props.data.value._id}`}>
                  <a>
                    <TransparentButton
                      style={{ marginLeft: "auto", marginRight: "0", color: "var(--f1)" }}>
                        <Icon className="fas fa-edit"></Icon>
                  </TransparentButton>
                  </a>
              </Link>

              {/* Delete */}
              <TransparentButton
                  onClick={() => toast.info(<RemoveCategoryToast category={props.data.value} 
                  onRemoveCategory={async() => await this.handleRemoveCategory(props.data.value)} />)} 
                  style={{ marginLeft: "auto", marginRight: "0", color: "var(--f1)" }}>
                      <Icon className="fas fa-trash"></Icon>
              </TransparentButton>
            </div>
          )}
        </div>
      </components.Option>
    );
  };

  render() {
    const { previews, categories, currentPage, totalBlogsCount, currentCategory, initialSearchProp } = this.state;
    const { user } =this.props;
    let searchText = "";
    searchText = this.state.searchText;

    console.log("current page", currentPage, "total blogs", totalBlogsCount);
    console.log("current category", currentCategory)


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
                    {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
                    <a href={`/blog/edit/article/${preview._id}`}>                  
                      <TransparentButton style={{ color: "var(--f1)" }}>
                        <Icon className="fas fa-edit"></Icon>
                      </TransparentButton>
                    </a>

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
        {/* Header Controls*/}
        <div className={blogStyles.headerControlsContainer}>

          {/* Search Filter */}
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

          {/* Category Filter */}
          <div className={blogStyles.headerControl}>           
            <Select 
              components={{ Option: this.getCustomCategoryOptions }}
              placeholder="Category"
              onChange={selected => this.handleCategoryChange(selected)} 
              options={categories ? categories.map(c => ({value: c, label: c.name})) : null} />
          </div>

          {/* New Blog (If Admin) */}
          {user && user.isAdmin && 
          (<div className={blogStyles.headerControl}>
            {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
            <a href={`/blog/post/article`}>                  
              <BasicButton style={{ width: "100%" }}>New Article</BasicButton>
            </a>
          </div>)}


        {/* New Category (If Admin) */}
        {user && user.isAdmin && 
          (<div className={blogStyles.headerControl}>
            <Link href="/blog/post/category">
              <a>                  
                <BasicButton style={{ width: "100%" }}>New Category</BasicButton>
              </a>
            </Link>
          </div>)}

      </div>

        {/* Main View */}
        <div>{view}</div>
      </Layout>
    );
  }
}

export default withAuthAsync(Blog)