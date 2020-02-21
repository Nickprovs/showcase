import Layout from "../../components/layout";
import { getSoftwareProjectPreviewsAsync } from "../../services/softwareService";
import softwareStyles from "../../styles/software.module.css";
import BasicButton from "../../components/common/basicButton";

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
              <img className={softwareStyles.containerFitImage} src={preview.image} />
            </div>
            <div className={softwareStyles.description}>
              <label>{preview.description}</label>
            </div>
            <div className={softwareStyles.previewButtons}>
              <BasicButton className={softwareStyles.postButton}>Read Article</BasicButton>
              <BasicButton className={softwareStyles.postButton}>Open Project</BasicButton>
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
