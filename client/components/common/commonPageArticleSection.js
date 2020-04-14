import { Component } from "react";
import { toast } from "react-toastify";
import blogStyles from "../../styles/blog.module.css";
import Icon from "./icon";
import TransparentButton from "./transparentButton";
import BasicButton from "./basicButton";
import Link from "next/link";
import Pagination from "./pagination";

const RemoveArticleToast = ({ closeToast, article, onRemoveArticleAsync }) => (
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={async () => await onRemoveArticleAsync(article)}>Remove</BasicButton>
  </div>
);

// Contract:
// General
// 1.) user - to render user-specific controls
// 2.) mainPagePath - for rendering links - "blog", "software", "photo", or "video"
// 3.) mainContentType - for rendering links - "article", "photo", "video"
// 4.) previews
// Commands
// 2.) onRemoveArticleAsync
// Pagination
// 1.) currentPage
// 2.) totalBlogsCount
// 3.) pageSize
class CommonPageArticleSection extends Component {
  constructor(props) {
    super(props);
  }

  getEmptyArticleSectionMarkup() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>No blogs found</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="director_sad.svg"></object>
        </div>
      </div>
    );
  }

  render() {
    const { user, mainPagePath, mainContentType, previews } = this.props;
    const { onRemoveArticleAsync } = this.props;
    const { currentPage, totalBlogsCount, pageSize } = this.props;

    //If we have no articles to display for this route...
    if (!previews || previews.length === 0) return this.getEmptyArticleSectionMarkup();

    return (
      <div>
        <div className={blogStyles.container}>
          {previews.map((preview) => (
            <div key={preview._id} className={blogStyles.item}>
              {/*Admin Controls*/}
              {user && user.isAdmin && (
                <div className={blogStyles.adminOptions}>
                  {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
                  <a href={`/${mainPagePath}/edit/${mainContentType}/${preview._id}`}>
                    <TransparentButton style={{ color: "var(--f1)" }}>
                      <Icon className="fas fa-edit"></Icon>
                    </TransparentButton>
                  </a>

                  <TransparentButton
                    onClick={() =>
                      toast.info(
                        <RemoveArticleToast
                          article={preview}
                          onRemoveArticleAsync={async (article) => await onRemoveArticleAsync(article)}
                        />
                      )
                    }
                    style={{ color: "var(--f1)" }}
                  >
                    <Icon className="fas fa-trash"></Icon>
                  </TransparentButton>
                </div>
              )}

              <div className={blogStyles.previewTitle}>
                <Link href={`/${mainPagePath}/[slug]`} as={`/${mainPagePath}/${preview.slug}`}>
                  <a className="clickableHeading">{preview.title}</a>
                </Link>
              </div>
              <div className={blogStyles.previewImage}>
                <Link href={`/${mainPagePath}/[slug]`} as={`/${mainPagePath}/${preview.slug}`}>
                  <a>
                    <img className={blogStyles.containerFitImage} src={preview.image} />
                  </a>
                </Link>
              </div>
              <div className={blogStyles.descriptionContainer}>
                <label className={blogStyles.description}>{preview.description}</label>
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
}

export default CommonPageArticleSection;
