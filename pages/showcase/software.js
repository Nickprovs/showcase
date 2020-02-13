import Layout from "../../components/layout";
import { getSoftwareProjectPreviewsAsync } from "../../services/softwareService";
import softwareStyles from "../../styles/software.module.css";

export default function Software(props) {
  const { previews } = props;
  console.log("client previews", previews);
  console.log(new Date());
  return (
    <Layout>
      <div className={softwareStyles.container}>
        {previews.map(preview => (
          <div className={softwareStyles.item}>
            <div className={softwareStyles.previewLabel}>
              <h2>{preview.title.toUpperCase()}</h2>
            </div>
            <div className={softwareStyles.previewImage}>
              <img className={softwareStyles.containerFitImage} src={preview.previewImageSrc} />
            </div>
            <div className={softwareStyles.previewText}>
              <label>{preview.previewText}</label>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

Software.getInitialProps = async function() {
  const res = await getSoftwareProjectPreviewsAsync();
  console.log("Got Data", res);
  return {
    previews: res.previews
  };
};
