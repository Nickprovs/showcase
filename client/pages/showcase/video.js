import Layout from "../../components/layout";
import { getVideosAsync } from "../../services/videoService";
import videoStyles from "../../styles/video.module.css";
import withAuthAsync from "../../components/common/withAuthAsync";
import { useEffect, useRef } from "react";

function Video(props) {
  const { videos, user } = props;

  let refs = useRef([]);

  useEffect(() => {
    // Update the document title using the browser API
    for (let outerVideoElement of refs.current) outerVideoElement.firstElementChild.className += videoStyles.containerFitImage;
  });

  return (
    <Layout user={user}>
      <div className={videoStyles.container}>
        {videos.map((video, i) => (
          <div className={videoStyles.item}>
            <div className={videoStyles.title}>
              <h2>{video.title.toUpperCase()}</h2>
            </div>
            <div className={videoStyles.video}>
              {/*TODO: Changed to iFrame or Video Tag*/}
              <div
                style={{ width: "100%", height: "100%" }}
                ref={(ref) => refs.current.push(ref)}
                dangerouslySetInnerHTML={{
                  className: videoStyles.containerFitImage,
                  __html: `
                  <iframe src="https://player.vimeo.com/video/138343914" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`,
                }}
              ></div>
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

Video.getInitialProps = async function () {
  const res = await getVideosAsync();
  console.log("Got Data", res);
  return {
    videos: res.videos,
  };
};

export default withAuthAsync(Video);
