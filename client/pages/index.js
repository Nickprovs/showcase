import Layout from "../components/layout";
import withAuthAsync from "../components/common/withAuthAsync";
import { Component } from "react";
import { getFeaturedAsync } from "../services/featuredService";
import indexStyles from "../styles/index.module.css";
import DangerousInnerHtmlWithScript from "../components/common/dangerousInnerHtmlWithScript";
import reframe from "reframe.js";
import Link from "next/link";
import TransparentButton from "../components/common/transparentButton";
import Icon from "../components/common/icon";
import { deleteFeaturedSubsidiaryAsync, patchFeaturedSubsidiaryAsync } from "../services/featuredService";
import { toast } from "react-toastify";

class Index extends Component {
  static async getInitialProps(context) {
    return await Index.getIndexDataAsync();
  }

  static async getIndexDataAsync() {
    const featuredRes = await getFeaturedAsync();
    const featured = await featuredRes.json();
    return {
      featured: featured.featured,
    };
  }

  state = {
    featured: null,
  };

  componentDidMount() {
    const { featured } = this.props;
    this.setState({ featured: featured });

    reframe("iframe");
  }

  componentDidUpdate(prevProps, prevState) {
    const { featured } = this.props;
    if (prevProps.featured !== featured) this.setState({ featured });
  }

  async handleRemoveFeaturedSubsidiary(subsidiary) {
    const { featured: originalFeatured } = this.state;
    let res = null;
    try {
      res = await deleteFeaturedSubsidiaryAsync(subsidiary.id);
      let originalFeaturedWithRemovedItem = { ...originalFeatured };
      originalFeaturedWithRemovedItem.subsidiaries.items.splice(originalFeatured.subsidiaries.items.indexOf(subsidiary), 1);
      this.setState({ featured: originalFeaturedWithRemovedItem });
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

  async handleMoveSubsidiaryAsync(subsidiary, direction) {
    if (direction !== "raise" && direction !== "lower")
      throw new Error('Invalid direction provided to asyncHandleMoveSubsidiary. Should be "raise" or "lower"');

    const { featured: originalFeatured } = this.state;

    let res = null;
    try {
      res = await patchFeaturedSubsidiaryAsync(subsidiary.id, { operation: direction });
      if (res.ok) {
        let data = await res.json();
        let updatedFeatured = { ...originalFeatured };
        updatedFeatured.subsidiaries = data;
        this.setState({ featured: updatedFeatured });
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

  getFeaturedSubsidiaryMarkup(subsidiary) {
    switch (subsidiary.type) {
      case "blog":
        return this.getFeaturedBlogMarkup(subsidiary);
      case "software":
        return this.getFeaturedSoftwareMarkup(subsidiary);
      case "photo":
      case "media":
    }
  }

  getFeaturedSoftwareMarkup(subsidiary) {
    const software = subsidiary.data;
    return (
      <div className={indexStyles.item}>
        <div className={indexStyles.previewType}>
          <Link href={`/showcase/software/[slug]`} as={`/showcase/software/${software.slug}`}>
            <a style={{ width: "100%", padding: "0px", textAlign: "center" }} className="clickableHeading">
              Featured Software
            </a>
          </Link>
        </div>
        <div className={indexStyles.previewTitle}>
          <Link href={`/showcase/software/[slug]`} as={`/showcase/software/${software.slug}`}>
            <a className="clickableHeading">{software.title}</a>
          </Link>
        </div>
        <div className={indexStyles.previewImage}>
          <Link href={`/showcase/software/[slug]`} as={`/showcase/software/${software.slug}`}>
            <a>
              <img className={indexStyles.containerFitImage} src={software.image} />
            </a>
          </Link>
        </div>
        <div className={indexStyles.descriptionContainer}>
          <label style={{ cursor: "text" }} className={indexStyles.description}>
            {software.description}
          </label>
        </div>
      </div>
    );
  }

  getFeaturedBlogMarkup(subsidiary) {
    const blog = subsidiary.data;
    return (
      <div key={blog._id} className={indexStyles.item}>
        <div className={indexStyles.adminOptions}>
          <TransparentButton onClick={async () => await this.handleMoveSubsidiaryAsync(subsidiary, "raise")} style={{ color: "var(--f1)" }}>
            <Icon className={"fas fa-arrow-up"}></Icon>
          </TransparentButton>
          <TransparentButton onClick={async () => await this.handleMoveSubsidiaryAsync(subsidiary, "lower")} style={{ color: "var(--f1)" }}>
            <Icon className={"fas fa-arrow-down"}></Icon>
          </TransparentButton>
          <TransparentButton onClick={async () => await this.handleRemoveFeaturedSubsidiary(subsidiary)} style={{ color: "var(--f1)" }}>
            <Icon className={"fas fa-star"}></Icon>
          </TransparentButton>
        </div>
        <div className={indexStyles.previewType}>
          <Link href={`/blog/[slug]`} as={`/blog/${blog.slug}`}>
            <a style={{ width: "100%", padding: "0px", textAlign: "center" }} className="clickableHeading">
              Featured Blog
            </a>
          </Link>
        </div>
        <div className={indexStyles.previewTitle}>
          <Link href={`/blog/[slug]`} as={`/blog/${blog.slug}`}>
            <a className="clickableHeading">{blog.title}</a>
          </Link>
        </div>
        <div className={indexStyles.previewImage}>
          <Link href={`/blog/[slug]`} as={`/blog/${blog.slug}`}>
            <a>
              <img className={indexStyles.containerFitImage} src={blog.image} />
            </a>
          </Link>
        </div>
        <div className={indexStyles.descriptionContainer}>
          <label style={{ cursor: "text" }} className={indexStyles.description}>
            {blog.description}
          </label>
        </div>
      </div>
    );
  }

  render() {
    const { user } = this.props;
    const { featured } = this.state;
    if (!featured) return <p>oops</p>;

    return (
      <Layout user={user}>
        <div
          dangerouslySetInnerHTML={{
            __html: featured.primary.markup,
          }}
        />

        <div className={indexStyles.container}>{featured.subsidiaries.items.map((item) => this.getFeaturedSubsidiaryMarkup(item))}</div>

        {/* Featured Photo */}
        {/* <div className={indexStyles.item}>
            <div className={indexStyles.previewType}>
              <h2>Featured Photo</h2>
            </div>
            <div className={indexStyles.previewTitle}>
              <h2>{featured.photo.title}</h2>
            </div>
            <div className={indexStyles.previewImage}>
              <a>
                <img className={indexStyles.containerFitImage} src={featured.photo.source} />
              </a>
            </div>
            <div className={indexStyles.descriptionContainer}>
              <label style={{ cursor: "text" }} className={indexStyles.description}>
                {featured.photo.description}
              </label>
            </div>
          </div> */}

        {/* Featured Video */}
        {/* <div className={indexStyles.item}>
            <div className={indexStyles.previewType}>
              <h2>Featured Video</h2>
            </div>
            <div className={indexStyles.previewTitle}>
              <h2>{featured.video.title}</h2>
            </div>
            <DangerousInnerHtmlWithScript className={indexStyles.videoContainer} html={featured.video.markup} />
            <div className={indexStyles.descriptionContainer}>
              <label style={{ cursor: "text" }} className={indexStyles.description}>
                This is a test 123
              </label>
            </div>
          </div>
        </div>  */}
      </Layout>
    );
  }
}

export default withAuthAsync(Index);
