import Layout from "../../components/layout";
import { getPhotosAsync } from "../../services/photoService";

export default function Photo(props) {
  const { photos } = props;
  console.log("photos!", photos);
  return (
    <Layout>
      <h1 className="mainContentTitle">Photo</h1>
      <div>
        {photos.map(photo => (
          <label>{photo.src}</label>
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
