import Layout from "../components/layout";
import withAuthAsync from "../components/common/withAuthAsync";
import { Component } from "react";
import { getFeaturedAsync } from "../services/featuredService";
import indexStyles from "../styles/index.module.css";
import DangerousInnerHtmlWithScript from "../components/common/dangerousInnerHtmlWithScript";
import reframe from "reframe.js";
import Link from "next/link";

class Index extends Component {
  static async getInitialProps(context) {
    const featuredRes = await getFeaturedAsync();
    const featured = await featuredRes.json();
    console.log(featured);
    return {
      featured: featured,
    };
  }

  componentDidMount() {
    console.log("Test1");
    reframe("iframe");
    reframe("blockquote");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("test");
    //Adjusts iframes in the page to fit based on aspect ration
    reframe("iframe");
  }

  render() {
    let { user, featured } = this.props;
    return (
      <Layout user={user}>
        <div dangerouslySetInnerHTML={{ __html: featured.body }} />
        <div className={indexStyles.container}>
          {/* Featured Software */}
          <div className={indexStyles.item}>
            <div className={indexStyles.previewType}>
              <Link href={`/showcase/software/[slug]`} as={`/showcase/software/${featured.software.slug}`}>
                <a style={{ width: "100%", padding: "0px", textAlign: "center" }} className="clickableHeading">
                  Featured Software
                </a>
              </Link>
            </div>
            <div className={indexStyles.previewTitle}>
              <Link href={`/showcase/software/[slug]`} as={`/showcase/software/${featured.software.slug}`}>
                <a className="clickableHeading">{featured.software.title}</a>
              </Link>
            </div>
            <div className={indexStyles.previewImage}>
              <Link href={`/showcase/software/[slug]`} as={`/showcase/software/${featured.software.slug}`}>
                <a>
                  <img className={indexStyles.containerFitImage} src={featured.software.image} />
                </a>
              </Link>
            </div>
            <div className={indexStyles.descriptionContainer}>
              <label style={{ cursor: "text" }} className={indexStyles.description}>
                {featured.software.description}
              </label>
            </div>
          </div>

          {/* Featured Blog */}
          <div className={indexStyles.item}>
            <div className={indexStyles.previewType}>
              <Link href={`/blog/[slug]`} as={`/blog/${featured.article.slug}`}>
                <a style={{ width: "100%", padding: "0px", textAlign: "center" }} className="clickableHeading">
                  Featured Blog
                </a>
              </Link>
            </div>
            <div className={indexStyles.previewTitle}>
              <Link href={`/blog/[slug]`} as={`/blog/${featured.article.slug}`}>
                <a className="clickableHeading">{featured.article.title}</a>
              </Link>
            </div>
            <div className={indexStyles.previewImage}>
              <Link href={`/blog/[slug]`} as={`/blog/${featured.article.slug}`}>
                <a>
                  <img className={indexStyles.containerFitImage} src={featured.article.image} />
                </a>
              </Link>
            </div>
            <div className={indexStyles.descriptionContainer}>
              <label style={{ cursor: "text" }} className={indexStyles.description}>
                {featured.article.description}
              </label>
            </div>
          </div>

          {/* Featured Photo */}
          <div className={indexStyles.item}>
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
          </div>

          {/* Featured Video */}
          <div className={indexStyles.item}>
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
        </div>
      </Layout>
    );
  }
}

export default withAuthAsync(Index);
