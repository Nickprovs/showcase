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
    const { src, visible, onCloseRequested } = this.props;
    let containerClasses = fullscreenPhotoStyles.container + " ";
    if (visible === true) containerClasses += fullscreenPhotoStyles.containerVisible + " ";

    return (
      <div onClick={() => onCloseRequested()} className={containerClasses}>
        <div className={fullscreenPhotoStyles.imageContainer}>
          <img className={fullscreenPhotoStyles.image} src={src} />
        </div>
        <TransparentButton onClick={() => onCloseRequested()} style={{ color: "var(--s1)" }} className={fullscreenPhotoStyles.closeButton}>
          <Icon className="fas fa-times" />
        </TransparentButton>
      </div>
    );
  }
}
