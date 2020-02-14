import fullscreenPhotoStyles from "../../styles/fullscreenPhoto.module.css";
import TransparentButton from "./transparentButton";
import Icon from "./icon";

export default function FullscreenPhoto(props) {
  const { src, visible } = props;

  return (
    <div className={fullscreenPhotoStyles.imageContainer}>
      <img className={fullscreenPhotoStyles.image} src={src} />
      <TransparentButton style={{ color: "var(--s1)" }} className={fullscreenPhotoStyles.closeButton}>
        <Icon className="fas fa-times" />
      </TransparentButton>
    </div>
  );
}
