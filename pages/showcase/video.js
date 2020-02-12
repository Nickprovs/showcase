import Layout from "../../components/layout";
import { getVideosAsync } from "../../services/videoService";
import videoStyles from "../../styles/video.module.css";

export default function Video(props) {
  const { videos } = props;
  return (
    <Layout>
      <h1 className="mainContentTitle">Video</h1>
      <div className={videoStyles.container}>
        {videos.map(video => (
          <div className={videoStyles.item}>
            <div className={videoStyles.title}>
              <label>{video.title}</label>
            </div>
            <div className={videoStyles.video}>
              {/*TODO: Changed to iFrame or Video Tag*/}
              <img className={videoStyles.containerFitImage} src={video.src} />
            </div>
            <div className={videoStyles.text}>
              <label>{video.previewText}</label>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

Video.getInitialProps = async function() {
  const res = await getVideosAsync();
  console.log("Got Data", res);
  return {
    videos: res.videos
  };
};
