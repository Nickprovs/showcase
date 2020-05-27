import fullscreenPhotoStyles from "../../styles/fullscreenPhoto.module.css";
import TransparentButton from "./transparentButton";
import Icon from "./icon";
import PhotoMetadataPresenter from "./photoMetadataPresenter";
import { Component } from "react";

export default class FullscreenPhoto extends Component {
  constructor() {
    super();
    this.handleEsc = this.handleEsc.bind(this);
  }

  state = {
    showMetadata: false,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleEsc);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleEsc);
  }

  handleEsc() {
    const { visible, onCloseRequested } = this.props;
    if (visible === true && event.keyCode === 27) {
      onCloseRequested();
    }
  }

  handleCloseRequest() {
    const { onCloseRequested } = this.props;
    this.setState({ showMetadata: false });
    onCloseRequested();
  }

  handleToggleMetadata() {
    const { showMetadata: currentShowMetadata } = this.state;
    this.setState({ showMetadata: !currentShowMetadata });
  }

  render() {
    const { src, visible, metadata = null } = this.props;
    const { showMetadata } = this.state;
    let containerClasses = fullscreenPhotoStyles.container + " ";
    if (visible === true) containerClasses += fullscreenPhotoStyles.containerVisible + " ";

    return (
      <div onClick={() => this.handleCloseRequest()} className={containerClasses}>
        <div className={fullscreenPhotoStyles.imageContainer}>
          <img className={fullscreenPhotoStyles.image} src={src} />
        </div>
        {metadata && showMetadata && (
          <div className={fullscreenPhotoStyles.metadataContainer}>
            <PhotoMetadataPresenter metadata={metadata} />
          </div>
        )}

        <div className={fullscreenPhotoStyles.buttonContainer}>
          <TransparentButton onClick={() => this.handleCloseRequest()} style={{ color: "var(--s1)" }}>
            <Icon className="fas fa-times" />
          </TransparentButton>
          <TransparentButton
            onClick={(e) => {
              this.handleToggleMetadata();
              e.stopPropagation();
            }}
            style={{ color: "var(--s1)" }}
          >
            <Icon className="fas fa-info-circle" />
          </TransparentButton>
        </div>
      </div>
    );
  }
}
