import Layout from "../components/layout";
import { getBlogPreviewsAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import Input from "../components/common/input";
import Pagination from "../components/common/pagination";
import Link from "next/link";
import Router from "next/router";
import { Component } from "react";

const pageSize = 6;

export default class Blog extends Component {
  static async getInitialProps(context) {
    let currentPage = 1;
    let search = "";

    if (context.query.page) currentPage = parseInt(context.query.page);
    if (context.query.search) search = context.query.search;

    const getOptions = {
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      search: search
    };

    const res = await getBlogPreviewsAsync(getOptions);

    return {
      previews: res.items,
      currentPage: currentPage,
      totalBlogsCount: res.total
    };
  }

  constructor() {
    super();
    this.handleSearchTextChanged = this.handleSearchTextChanged.bind(this);
    this.handleSearchTimerElapsed = this.handleSearchTimerElapsed.bind(this);
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  componentDidMount() {
    if (Router.query.search) this.setState({ searchText: Router.query.search });
  }

  state = {
    searchText: ""
  };

  handleSearchTextChanged(text) {
    this.setState({ searchText: text });
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(this.handleSearchTimerElapsed, 700);
  }

  handleSearchTimerElapsed() {
    const { searchText } = this.state;
    const query = {};
    if (searchText) query.search = searchText;

    Router.push({
      pathname: Router.pathname,
      query: query
    });
  }

  render() {
    const { previews, currentPage, totalBlogsCount } = this.props;
    const { searchText } = this.state;

    let view = (
      <div style={{ textAlign: "center" }}>
        <h1>No blogs found</h1>
        <object style={{ width: "35%" }} type="image/svg+xml" data="director_sad.svg"></object>
      </div>
    );

    if (previews.length > 0) {
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
        <form onSubmit={e => this.handleSearchTextChanged(e.target.value)}>
          <Input
            onChange={e => this.handleSearchTextChanged(e.target.value)}
            value={searchText}
            placeholder="Search..."
            style={{ width: "30%", marginLeft: "20px" }}
          />
        </form>
        {view}
      </Layout>
    );
  }
}
