import fullscreenPhotoStyles from "../../../styles/common/photo/fullscreenPhoto.module.css";
import TransparentButton from "../button/transparentButton";
import PhotoMetadataPresenter from "./photoMetadataPresenter";
import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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
          <img alt={metadata ? metadata.description : ""} className={fullscreenPhotoStyles.image} src={src} />
        </div>
        {metadata && showMetadata && (
          <div className={fullscreenPhotoStyles.metadataContainer}>
            <PhotoMetadataPresenter classes={{ tags: fullscreenPhotoStyles.metadataTags }} metadata={metadata} />
          </div>
        )}

        <div className={fullscreenPhotoStyles.buttonContainer}>
          <TransparentButton onClick={() => this.handleCloseRequest()} style={{ color: "var(--s1)" }}>
            <FontAwesomeIcon size="2x" icon={faTimes} />
          </TransparentButton>
          <TransparentButton
            onClick={(e) => {
              this.handleToggleMetadata();
              e.stopPropagation();
            }}
            style={{ color: "var(--s1)" }}
          >
            <FontAwesomeIcon size="2x" icon={faInfoCircle} />
          </TransparentButton>
        </div>
      </div>
    );
  }
}
