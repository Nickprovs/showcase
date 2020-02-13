import Layout from "../../components/layout";
import { getPhotosAsync } from "../../services/photoService";
import photoStyles from "../../styles/photo.module.css";

export default function Photo(props) {
  const { photos } = props;
  console.log("photos!", photos);

  const getClassesForPhoto = photo => {
    if (photo.orientation === "portrait") return photoStyles.portrait;
    else return photoStyles.landscape;
  };

  return (
    <Layout>
      <div className={photoStyles.container}>
        {photos.map(photo => (
          <div className={getClassesForPhoto(photo)}>
            <img className={photoStyles.containerFitImage} src={photo.src} />
          </div>
        ))}
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
