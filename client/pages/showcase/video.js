import Layout from "../../components/layout";
import { getVideosAsync } from "../../services/videoService";
import videoStyles from "../../styles/video.module.css";
import withAuthAsync from "../../components/common/withAuthAsync";

function Video(props) {
  const { videos, user } = props;
  return (
    <Layout user={user}>
      <div className={videoStyles.container}>
        {videos.map(video => (
          <div className={videoStyles.item}>
            <div className={videoStyles.title}>
              <h2>{video.title.toUpperCase()}</h2>
            </div>
            <div className={videoStyles.video}>
              {/*TODO: Changed to iFrame or Video Tag*/}
              <img className={videoStyles.containerFitImage} src={video.src} />
            </div>
            <div className={videoStyles.text}>
              <label>{video.description}</label>
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

export default withAuthAsync(Video);