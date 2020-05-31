import withAuthAsync from "../components/common/hoc/withAuthAsync";
import withLayoutAsync from "../components/common/hoc/withLayoutAsync";
import FullscreenPhoto from "../components/common/fullscreenPhoto";
import { Component } from "react";
import { getFeaturedAsync } from "../services/featuredService";
import indexStyles from "../styles/index.module.css";
import DangerousInnerHtmlWithScript from "../components/common/dangerousInnerHtmlWithScript";
import DatePostedPresenter from "../components/common/datePostedPresenter";
import reframe from "reframe.js";
import Link from "next/link";
import TransparentButton from "../components/common/transparentButton";
import Icon from "../components/common/icon";
import { deleteFeaturedSubsidiaryAsync, patchFeaturedSubsidiaryAsync } from "../services/featuredService";
import { toast } from "react-toastify";

const SubsidiaryAdminOptions = ({ subsidiary, onMoveSubsidiaryAsync, onRemoveSubsidiaryAsync }) => {
  return (
    <div className={indexStyles.subsidiaryAdminOptions}>
      <TransparentButton onClick={async () => await onMoveSubsidiaryAsync(subsidiary, "raise")} style={{ color: "var(--f1)" }}>
        <Icon className={"fas fa-arrow-up"}></Icon>
      </TransparentButton>
      <TransparentButton onClick={async () => await onMoveSubsidiaryAsync(subsidiary, "lower")} style={{ color: "var(--f1)" }}>
        <Icon className={"fas fa-arrow-down"}></Icon>
      </TransparentButton>
      <TransparentButton onClick={async () => await onRemoveSubsidiaryAsync(subsidiary)} style={{ color: "var(--f1)" }}>
        <Icon className={"fas fa-star"}></Icon>
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

    reframe("iframe");
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
        return this.getFeaturedBlogMarkup(subsidiary);
      case "software":
        return this.getFeaturedSoftwareMarkup(subsidiary);
      case "photo":
        return this.getFeaturedPhotoMarkup(subsidiary);
      case "media":
        return this.getFeaturedMediaMarkup(subsidiary);
    }
  }

  getFeaturedSoftwareMarkup(subsidiary) {
    const software = subsidiary.data;
    const { user } = this.props;
    return (
      <div className={indexStyles.item}>
        {user && user.isAdmin && (
          <SubsidiaryAdminOptions
            subsidiary={subsidiary}
            onMoveSubsidiaryAsync={this.handleMoveSubsidiaryAsync}
            onRemoveSubsidiaryAsync={this.handleRemoveSubsidiaryAsync}
          />
        )}
        <div className={indexStyles.previewType}>
          <Link href={`/showcase/software/[slug]`} as={`/showcase/software/${software.slug}`}>
            <a style={{ width: "100%", padding: "0px", textAlign: "center" }} className="clickableHeading">
              Featured Software
            </a>
          </Link>
          <DatePostedPresenter date={software.datePosted} />
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
    const { user } = this.props;
    return (
      <div key={blog._id} className={indexStyles.item}>
        {user && user.isAdmin && (
          <SubsidiaryAdminOptions
            subsidiary={subsidiary}
            onMoveSubsidiaryAsync={this.handleMoveSubsidiaryAsync}
            onRemoveSubsidiaryAsync={this.handleRemoveSubsidiaryAsync}
          />
        )}
        <div className={indexStyles.previewType}>
          <Link href={`/blog/[slug]`} as={`/blog/${blog.slug}`}>
            <a style={{ width: "100%", padding: "0px", textAlign: "center" }} className="clickableHeading">
              Featured Blog
            </a>
          </Link>
          <DatePostedPresenter date={blog.datePosted} />
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

  getFeaturedMediaMarkup(subsidiary) {
    const media = subsidiary.data;
    const { user } = this.props;
    return (
      <div className={indexStyles.item}>
        {user && user.isAdmin && (
          <SubsidiaryAdminOptions
            subsidiary={subsidiary}
            onMoveSubsidiaryAsync={this.handleMoveSubsidiaryAsync}
            onRemoveSubsidiaryAsync={this.handleRemoveSubsidiaryAsync}
          />
        )}
        <div className={indexStyles.previewType}>
          <h2>Featured Media</h2>
          <DatePostedPresenter date={media.datePosted} />
        </div>
        <div className={indexStyles.previewTitle}>
          <h2>{media.title}</h2>
        </div>
        <DangerousInnerHtmlWithScript className={indexStyles.mediaContainer} html={media.markup} />
        <div className={indexStyles.descriptionContainer}>
          <label style={{ cursor: "text" }} className={indexStyles.description}>
            This is a test 123
          </label>
        </div>
      </div>
    );
  }

  getFeaturedPhotoMarkup(subsidiary) {
    const photo = subsidiary.data;
    const { user } = this.props;
    return (
      <div className={indexStyles.item}>
        {user && user.isAdmin && (
          <SubsidiaryAdminOptions
            subsidiary={subsidiary}
            onMoveSubsidiaryAsync={this.handleMoveSubsidiaryAsync}
            onRemoveSubsidiaryAsync={this.handleRemoveSubsidiaryAsync}
          />
        )}
        <div className={indexStyles.previewType}>
          <h2>Featured Photo</h2>
          <DatePostedPresenter date={photo.datePosted} />
        </div>
        <div className={indexStyles.previewTitle}>
          <h2>{photo.title}</h2>
        </div>
        <div className={indexStyles.photoContainer}>
          <a>
            <img onClick={() => this.handleOpenFullScreenPhoto(photo)} className={indexStyles.preservedAspectRatioPhoto} src={photo.source} />
          </a>
        </div>
        <div className={indexStyles.descriptionContainer}>
          <label style={{ cursor: "text" }} className={indexStyles.description}>
            {photo.description}
          </label>
        </div>
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
    const { user } = this.props;
    const { featured, fullScreenPhoto, fullScreenPhotoVisible } = this.state;
    if (!featured) return <p>oops</p>;
    return (
      <div>
        {/*Primary Featured Content*/}
        <div class={indexStyles.primaryContainer}>
          {user && user.isAdmin && (
            <div className={indexStyles.primaryAdminOptions}>
              <a href={`/index/edit/primary`}>
                <TransparentButton>
                  <Icon className={"fas fa-edit"}></Icon>
                </TransparentButton>
              </a>
            </div>
          )}
          <div
            dangerouslySetInnerHTML={{
              __html: featured.primary.markup,
            }}
          />
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
  }
}

export default withAuthAsync(withLayoutAsync(Index));
