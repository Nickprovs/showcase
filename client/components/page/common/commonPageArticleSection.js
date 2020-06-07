import { Component } from "react";
import { toast } from "react-toastify";
import articleSectionStyles from "../../../styles/page/common/articleSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import TransparentButton from "../../common/button/transparentButton";
import BasicButton from "../../common/button/basicButton";
import Link from "next/link";
import Pagination from "../../common/misc/pagination";
import DatePostedPresenter from "../../common/date/datePostedPresenter";
import TagPresenter from "../../common/misc/tagPresenter";

const RemoveArticleToast = ({ closeToast, article, onRemoveArticleAsync }) => (
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={async () => await onRemoveArticleAsync(article)}>Remove</BasicButton>
  </div>
);

// Contract:
// General
// 1.) user - to render user-specific controls
// 2.) mainPagePath - for rendering links - "blog", "software", "photo", or "media"
// 3.) mainContentType - for displaying "No [mainContentType]s found"
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
    const { mainContentType } = this.props;

    return (
      <div style={{ textAlign: "center" }}>
        <h1>{`No ${mainContentType}s found.`}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/images/director_sad.svg"></object>
        </div>
      </div>
    );
  }

  render() {
    const { user, mainPagePath, previews, featured } = this.props;
    const { onToggleFeaturedArticleAsync, onRemoveArticleAsync } = this.props;
    const { currentPage, totalBlogsCount, pageSize } = this.props;

    //If we have no articles to display for this route...

    return (
      <div>
        {!previews || previews.length === 0 ? (
          this.getEmptyArticleSectionMarkup()
        ) : (
          <div className={articleSectionStyles.container}>
            {previews.map((preview) => (
              <div key={preview._id} className={articleSectionStyles.item}>
                {/*Admin Controls*/}
                {user && user.isAdmin && (
                  <div className={articleSectionStyles.adminOptions}>
                    <TransparentButton onClick={async () => await onToggleFeaturedArticleAsync(preview)} style={{ color: "var(--f1)" }}>
                      <FontAwesomeIcon size="2x" icon={featured.subsidiaries.items.some((item) => item.id === preview._id) ? fasStar : farStar} />
                    </TransparentButton>
                    {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
                    <a href={`/${mainPagePath}/edit/article/${preview._id}`}>
                      <TransparentButton style={{ color: "var(--f1)" }}>
                        <FontAwesomeIcon size="2x" icon={faEdit} />
                      </TransparentButton>
                    </a>
                    <TransparentButton
                      onClick={() =>
                        toast.info(<RemoveArticleToast article={preview} onRemoveArticleAsync={async (article) => await onRemoveArticleAsync(article)} />)
                      }
                      style={{ color: "var(--f1)" }}
                    >
                      <FontAwesomeIcon size="2x" icon={faTrash} />
                    </TransparentButton>
                  </div>
                )}

                <div className={articleSectionStyles.previewTitle}>
                  <Link href={`/${mainPagePath}/[slug]`} as={`/${mainPagePath}/${preview.slug}`}>
                    <a className="clickableHeading">{preview.title}</a>
                  </Link>
                </div>
                <div className={articleSectionStyles.previewDate}>
                  <DatePostedPresenter date={preview.datePosted} />
                </div>
                <div className={articleSectionStyles.previewImage}>
                  <Link href={`/${mainPagePath}/[slug]`} as={`/${mainPagePath}/${preview.slug}`}>
                    <a>
                      <img className={articleSectionStyles.containerFitImage} src={preview.image} />
                    </a>
                  </Link>
                </div>
                <div className={articleSectionStyles.descriptionContainer}>
                  <p className={articleSectionStyles.description}>{preview.description}</p>
                </div>
                <div className={articleSectionStyles.tags}>
                  <TagPresenter tags={preview.tags} />
                </div>
                {preview.addressableHighlights && preview.addressableHighlights.length > 0 && (
                  <div className={articleSectionStyles.links}>
                    {preview.addressableHighlights.map((addressableHighlight) => (
                      <a
                        key={addressableHighlight.label}
                        style={{ marginLeft: "10px", marginRight: "10px" }}
                        target="_blank"
                        href={addressableHighlight.address}
                      >
                        {addressableHighlight.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className={articleSectionStyles.paginationContainer}>
          <Pagination itemsCount={totalBlogsCount} pageSize={pageSize} currentPage={currentPage} />
        </div>
      </div>
    );
  }
}

export default CommonPageArticleSection;
