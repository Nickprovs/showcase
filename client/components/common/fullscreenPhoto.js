import fullscreenPhotoStyles from "../../styles/fullscreenPhoto.module.css";
import TransparentButton from "./transparentButton";
import Icon from "./icon";
import { Component } from "react";

export default class FullscreenPhoto extends Component {
  constructor() {
    super();
    this.handleEsc = this.handleEsc.bind(this);
  }

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

  render() {
    const { src, visible, onCloseRequested, metadata = null } = this.props;
    let containerClasses = fullscreenPhotoStyles.container + " ";
    if (visible === true) containerClasses += fullscreenPhotoStyles.containerVisible + " ";

    return (
      <div onClick={() => onCloseRequested()} className={containerClasses}>
        <div className={fullscreenPhotoStyles.imageContainer}>
          <img className={fullscreenPhotoStyles.image} src={src} />
        </div>
        {metadata && (
          <div
            style={{
              display: "flex",
              alignContent: "flex-start",
              alignItems: "flex-end",
              flexFlow: "column",
              position: "absolute",
              bottom: "0px",
              right: "0px",
              marginBottom: "10px",
              marginRight: "10px",
            }}
          >
            {metadata.title && <label style={{ color: "white", fontSize: "2vmin" }}>Title: {metadata.title}</label>}
            {metadata.description && <label style={{ color: "white", fontSize: "2vmin" }}>Description: {metadata.description}</label>}
            {metadata.tags && <label style={{ color: "white", fontSize: "2vmin" }}>Tags: {metadata.tags}</label>}
          </div>
        )}

        <TransparentButton onClick={() => onCloseRequested()} style={{ color: "var(--s1)" }} className={fullscreenPhotoStyles.closeButton}>
          <Icon className="fas fa-times" />
        </TransparentButton>
      </div>
    );
  }
}
