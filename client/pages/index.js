import withAuthAsync from "../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../components/common/hoc/withLayoutAsync";
import FullscreenPhoto from "../components/common/photo/fullscreenPhoto";
import { Component } from "react";
import { getFeaturedAsync } from "../services/featuredService";
import indexStyles from "../styles/page/index.module.css";
import DangerouslySetInnerHtmlWithScript from "../components/common/misc/dangerouslySetInnerHtmlWithScript";
import DatePostedPresenter from "../components/common/date/datePostedPresenter";
import reframe from "reframe.js";
import Link from "next/link";
import TransparentButton from "../components/common/button/transparentButton";
import { deleteFeaturedSubsidiaryAsync, patchFeaturedSubsidiaryAsync } from "../services/featuredService";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faStar, faEdit } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import FormatUtilities from "../util/formatUtilities";
import StringUtilities from "../util/stringUtilities";
import initializeDomPurify from "../misc/customDomPurify";
import { sanitize } from "isomorphic-dompurify";

const SubsidiaryAdminOptions = ({ subsidiary, editPath, editPathAs, onMoveSubsidiaryAsync, onRemoveSubsidiaryAsync }) => {
  return (
    <div className={indexStyles.subsidiaryAdminOptions}>
      <Link href={editPath} as={editPathAs} legacyBehavior>
        <span aria-label="Edit Content">
          <TransparentButton aria-label="Edit Content" style={{ color: "var(--f1)" }}>
            <FontAwesomeIcon size="2x" icon={faEdit} />
          </TransparentButton>
        </span>
      </Link>
      <TransparentButton aria-label="Move Content Up" onClick={async () => await onMoveSubsidiaryAsync(subsidiary, "raise")} style={{ color: "var(--f1)" }}>
        <FontAwesomeIcon size="2x" icon={faArrowUp} />
      </TransparentButton>
      <TransparentButton aria-label="Move Content Down" onClick={async () => await onMoveSubsidiaryAsync(subsidiary, "lower")} style={{ color: "var(--f1)" }}>
        <FontAwesomeIcon size="2x" icon={faArrowDown} />
      </TransparentButton>
      <TransparentButton aria-label="Remove From Featured" onClick={async () => await onRemoveSubsidiaryAsync(subsidiary)} style={{ color: "var(--f1)" }}>
        <FontAwesomeIcon size="2x" icon={faStar} />
      </TransparentButton>
    </div>
  );
};

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
    fullScreenPhotoVisible: false,
    fullScreenPhoto: null,
  };

  constructor(props) {
    super(props);

    this.handleMoveSubsidiaryAsync = this.handleMoveSubsidiaryAsync.bind(this);
    this.handleRemoveSubsidiaryAsync = this.handleRemoveSubsidiaryAsync.bind(this);
  }

  componentDidMount() {
    const { featured } = this.props;
    this.setState({ featured: featured });

    initializeDomPurify();
    setTimeout(() => reframe("iframe"), 0);
  }

  componentDidUpdate(prevProps, prevState) {
    const { featured } = this.props;
    if (prevProps.featured !== featured) this.setState({ featured });
  }

  async handleRemoveSubsidiaryAsync(subsidiary) {
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
        return this.getFeaturedArticleMarkup(subsidiary, "blog", "blog");
      case "portfolio":
        return this.getFeaturedArticleMarkup(subsidiary, "portfolio", "portfolio");
      case "photo":
        return this.getFeaturedPhotoMarkup(subsidiary);
      case "media":
        return this.getFeaturedMediaMarkup(subsidiary);
    }
  }

  getFeaturedArticleMarkup(subsidiary, type, mainPath) {
    const article = subsidiary.data;
    const { user } = this.props;
    return (
      <div key={article._id} className={indexStyles.item}>
        {user && user.isAdmin && (
          <SubsidiaryAdminOptions
            subsidiary={subsidiary}
            editPath={`${mainPath}/edit/article/[id]`}
            editPathAs={`${mainPath}/edit/article/${subsidiary.data._id}`}
            onMoveSubsidiaryAsync={this.handleMoveSubsidiaryAsync}
            onRemoveSubsidiaryAsync={this.handleRemoveSubsidiaryAsync}
          />
        )}
        <div className={indexStyles.previewType}>
          <Link 
            href={`/${mainPath}/[slug]`} 
            as={`/${mainPath}/${article.slug}`} 
            style={{ width: "100%", padding: "0px", textAlign: "center" }}
            className="commonEntryHeading">
            {`Featured  ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </Link>
          <DatePostedPresenter date={article.datePosted} />
        </div>
        <div className={indexStyles.previewTitle}>
          <Link href={`/${mainPath}/[slug]`} as={`/${mainPath}/${article.slug}`} className="commonEntryHeading">
            {article.title}
          </Link>
        </div>
        <div className={indexStyles.previewImage}>
          <Link href={`/${mainPath}/[slug]`} as={`/${mainPath}/${article.slug}`}>
            <img alt="" className={indexStyles.containerFitImage} src={article.image} />
          </Link>
        </div>
        <div className={indexStyles.descriptionContainer}>
          <label style={{ cursor: "text" }} className={indexStyles.description}>
            {article.description}
          </label>
        </div>
        {article.addressableHighlights && article.addressableHighlights.length > 0 && (
          <div className={indexStyles.addressableHighlights}>
            {article.addressableHighlights.map((addressableHighlight) => (
              <a
                rel="noopener"
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
    );
  }

  getFeaturedMediaMarkup(subsidiary) {
    const media = subsidiary.data;
    const { user } = this.props;
    return (
      <div key={media._id} className={indexStyles.item}>
        {user && user.isAdmin && (
          <SubsidiaryAdminOptions
            editPath={`media/edit/media/[id]`}
            editPathAs={`media/edit/media/${subsidiary.data._id}`}
            subsidiary={subsidiary}
            onMoveSubsidiaryAsync={this.handleMoveSubsidiaryAsync}
            onRemoveSubsidiaryAsync={this.handleRemoveSubsidiaryAsync}
          />
        )}
        <div className={indexStyles.previewType}>
          <h2 style={{ width: "100%", padding: "0px", textAlign: "center" }} className="commonEntryHeading">
            Featured Media
          </h2>
          <DatePostedPresenter date={media.datePosted} />
        </div>
        <div className={indexStyles.previewTitle}>
          <h2 style={{ width: "100%", padding: "0px", textAlign: "center" }} className="commonEntryHeading">
            {media.title}
          </h2>
        </div>
        <DangerouslySetInnerHtmlWithScript className={indexStyles.mediaContainer} html={sanitize(media.markup)} />
        <div className={indexStyles.descriptionContainer}>
          <p className={indexStyles.description}>{media.description}</p>
        </div>
        {media.addressableHighlights && media.addressableHighlights.length > 0 && (
          <div className={indexStyles.addressableHighlights}>
            {media.addressableHighlights.map((addressableHighlight) => (
              <a
                rel="noopener"
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
    );
  }

  getFeaturedPhotoMarkup(subsidiary) {
    const photo = subsidiary.data;
    const { user } = this.props;
    return (
      <div key={photo._id} className={indexStyles.item}>
        {user && user.isAdmin && (
          <SubsidiaryAdminOptions
            editPath={`photo/edit/photo/[id]`}
            editPathAs={`photo/edit/photo/${subsidiary.data._id}`}
            subsidiary={subsidiary}
            onMoveSubsidiaryAsync={this.handleMoveSubsidiaryAsync}
            onRemoveSubsidiaryAsync={this.handleRemoveSubsidiaryAsync}
          />
        )}
        <div className={indexStyles.previewType}>
          <h2 style={{ width: "100%", padding: "0px", textAlign: "center" }} className="commonEntryHeading">
            Featured Photo
          </h2>
          <DatePostedPresenter date={photo.datePosted} />
        </div>
        <div className={indexStyles.previewTitle}>
          <h2 style={{ width: "100%", padding: "0px", textAlign: "center" }} className="commonEntryHeading">
            {photo.title}
          </h2>
        </div>
        <div className={indexStyles.photoContainer}>
          <a>
            <img
              alt={photo.description}
              onClick={() => this.handleOpenFullScreenPhoto(photo)}
              className={indexStyles.preservedAspectRatioPhoto}
              src={photo.source}
            />
          </a>
        </div>
        <div className={indexStyles.descriptionContainer}>
          <p className={indexStyles.description}>{photo.description}</p>
        </div>
        {photo.addressableHighlights && photo.addressableHighlights.length > 0 && (
          <div className={indexStyles.addressableHighlights}>
            {photo.addressableHighlights.map((addressableHighlight) => (
              <a
                rel="noopener"
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
    );
  }

  handleOpenFullScreenPhoto(photo) {
    this.setState({ fullScreenPhoto: photo });
    this.setState({ fullScreenPhotoVisible: true });
  }

  handleCloseFullScreenPhoto() {
    this.setState({ fullScreenPhoto: null });
    this.setState({ fullScreenPhotoVisible: false });
  }

  render() {
    const { user, general, domainUrl } = this.props;
    const { featured, fullScreenPhoto, fullScreenPhotoVisible } = this.state;
    let markupBody;
    if (!featured) markupBody = <p>oops</p>;
    else
      markupBody = (
        <div>
          {/*Primary Featured Content*/}
          <div className={indexStyles.primaryContainer}>
            {user && user.isAdmin && (
              <div className={indexStyles.primaryAdminOptions}>
                <Link href={`/index/edit/primary`}>
                    <TransparentButton aria-label="Edit Primary Featured Content">
                      <FontAwesomeIcon size="2x" icon={faEdit} />
                    </TransparentButton>
                </Link>
              </div>
            )}
            <DangerouslySetInnerHtmlWithScript html={sanitize(featured.primary.markup)} />
          </div>

          {/*Subsidiary Featured Content*/}
          {featured.subsidiaries && featured.subsidiaries.items.length > 0 && (
            <div className={indexStyles.container}>{featured.subsidiaries.items.map((item) => this.getFeaturedSubsidiaryMarkup(item))}</div>
          )}

          <FullscreenPhoto
            onCloseRequested={() => this.handleCloseFullScreenPhoto()}
            visible={fullScreenPhotoVisible}
            src={fullScreenPhoto ? fullScreenPhoto.source : ""}
            metadata={fullScreenPhoto}
          />
        </div>
      );
    return (
      <div>
        <Head>
          <meta property="og:title" content={general.title} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`${domainUrl}/images/meta-main.jpg`} />
          <meta property="og:description" content={`The home of ${StringUtilities.toEachWordCapitalized(general.title)}.`} />
          <meta name="twitter:card" content="summary" />
          <title>{FormatUtilities.getFormattedWebsiteTitle("Home", general ? general.title : "Showcase")}</title>
          <meta name="description" content={`The home of ${StringUtilities.toEachWordCapitalized(general.title)}.`} />
        </Head>
        {markupBody}
      </div>
    );
  }
}

export default withAuthAsync(withLayoutAsync(Index));
