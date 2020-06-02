import { Component } from "react";
import { toast } from "react-toastify";
import articleSectionStyles from "../../styles/articleSection.module.css";
import Icon from "./misc/icon";
import TransparentButton from "./button/transparentButton";
import BasicButton from "./button/basicButton";
import Link from "next/link";
import Pagination from "./misc/pagination";
import DatePostedPresenter from "./datePostedPresenter";
import TagPresenter from "./misc/tagPresenter";

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
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/director_sad.svg"></object>
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
                      <Icon className={featured.subsidiaries.items.some((item) => item.id === preview._id) ? "fas fa-star" : "far fa-star"}></Icon>
                    </TransparentButton>
                    {/*Workaround: <a/> over <Link/> due to next head tiny mce race condition during client side nav*/}
                    <a href={`/${mainPagePath}/edit/article/${preview._id}`}>
                      <TransparentButton style={{ color: "var(--f1)" }}>
                        <Icon className="fas fa-edit"></Icon>
                      </TransparentButton>
                    </a>
                    <TransparentButton
                      onClick={() =>
                        toast.info(<RemoveArticleToast article={preview} onRemoveArticleAsync={async (article) => await onRemoveArticleAsync(article)} />)
                      }
                      style={{ color: "var(--f1)" }}
                    >
                      <Icon className="fas fa-trash"></Icon>
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
                  <label className={articleSectionStyles.description}>{preview.description}</label>
                </div>
                <div className={articleSectionStyles.tags}>
                  <TagPresenter tags={preview.tags} />
                </div>
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
