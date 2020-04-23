import Layout from "../../components/layout";
import { getPhotosAsync } from "../../services/photoService";
import photoStyles from "../../styles/photo.module.css";
import FullscreenPhoto from "../../components/common/fullscreenPhoto";
import { useState } from "react";
import withAuthAsync from "../../components/common/withAuthAsync";

function Photo(props) {
  const { photos, user } = props;
  console.log("photos!", photos);

  const getClassesForPhoto = (photo) => {
    const displaySizeWithFirstCharUppercase = photo.displaySize.charAt(0).toUpperCase() + photo.displaySize.slice(1);
    const photoClassName = photo.orientation + displaySizeWithFirstCharUppercase;

    if (photoClassName in photoStyles) return photoStyles[photoClassName];
    else {
      console.error("Coudn't find appropriate photo class for orientation and displaySize");
      return photoStyles.landscapeMedium;
    }
  };

  const [fullscreenPhotoSrc, setFullscreenPhotoSrc] = useState("");
  const [fullscreenPhotoVisible, setFullscreenPhotoVisible] = useState(false);

  const setFullscreenPhoto = (src) => {
    setFullscreenPhotoSrc(src);
    setFullscreenPhotoVisible(true);
  };

  const handleFullscreenPhotoCloseRequested = () => {
    console.log("eee");
    setFullscreenPhotoVisible(false);
    setFullscreenPhotoSrc("");
  };

  return (
    <Layout user={user}>
      <div style={{ zIndex: "200" }} className={photoStyles.container}>
        {photos.map((photo) => (
          <div title={`Orientation: ${photo.orientation}, DisplaySize: ${photo.displaySize}`} className={getClassesForPhoto(photo)}>
            <img onClick={() => setFullscreenPhoto(photo.source)} className={photoStyles.containerFitImage} src={photo.source} />
          </div>
        ))}
        <FullscreenPhoto
          onCloseRequested={() => handleFullscreenPhotoCloseRequested()}
          visible={fullscreenPhotoVisible}
          src={fullscreenPhotoSrc}
        />
      </div>
    </Layout>
  );
}

Photo.getInitialProps = async function () {
  const res = await getPhotosAsync();
  console.log("Got Data", res);
  return {
    photos: res.photos,
  };
};

export default withAuthAsync(Photo);
