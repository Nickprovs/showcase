import Layout from "../../components/layout";
import { getVideosAsync } from "../../services/videoService";
import videoStyles from "../../styles/video.module.css";
import withAuthAsync from "../../components/common/withAuthAsync";
import { useEffect, useRef } from "react";
import { Component } from "react";

class Video extends Component {
  static async getInitialProps(context) {
    const res = await getVideosAsync();
    return {
      videos: res.videos,
    };
  }

  constructor(props) {
    super(props);
    this.videoContainerRefs = [];
  }

  setVideoContainerRefs = (ref) => {
    this.videoContainerRefs.push(ref);
  };

  componentDidMount() {
    for (let videoContainer of this.videoContainerRefs) videoContainer.firstElementChild.className += videoStyles.containerFitImage;
  }

  render() {
    const { videos, user } = this.props;

    return (
      <Layout user={user}>
        <div className={videoStyles.container}>
          {videos.map((video, i) => (
            <div key={video._id} className={videoStyles.item}>
              <div className={videoStyles.title}>
                <h2>{video.title.toUpperCase()}</h2>
              </div>
              <div className={videoStyles.video}>
                {/*TODO: Changed to iFrame or Video Tag*/}
                <div
                  style={{ width: "100%", height: "100%" }}
                  ref={this.setVideoContainerRefs}
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
}

export default withAuthAsync(Video);
