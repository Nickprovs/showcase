import Layout from "../../components/layout";
import { getPhotosAsync } from "../../services/photoService";
import photoStyles from "../../styles/photo.module.css";
import FullscreenPhoto from "../../components/common/fullscreenPhoto";
import { useState } from "react";

export default function Photo(props) {
  const { photos } = props;
  console.log("photos!", photos);

  const getClassesForPhoto = photo => {
    if (photo.orientation === "portrait") return photoStyles.portrait;
    else return photoStyles.landscape;
  };

  const [mainSrc, setMainSrc] = useState("");

  return (
    <Layout>
      <div style={{ zIndex: "200" }} className={photoStyles.container}>
        {photos.map(photo => (
          <div className={getClassesForPhoto(photo)}>
            <img onClick={() => setMainSrc(photo.src)} className={photoStyles.containerFitImage} src={photo.src} />
          </div>
        ))}
        <FullscreenPhoto src={mainSrc} />
      </div>
    </Layout>
  );
}

Photo.getInitialProps = async function() {
  const res = await getPhotosAsync();
  console.log("Got Data", res);
  return {
    photos: res.photos
  };
};
