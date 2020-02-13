import Layout from "../components/layout";
import { getBlogPreviewsAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";

export default function Blog(props) {
  const { previews } = props;
  return (
    <Layout>
      <div className={blogStyles.container}>
        {previews.map(preview => (
          <div className={blogStyles.item}>
            <div className={blogStyles.previewLabel}>
              <h2>{preview.title}</h2>
            </div>
            <div className={blogStyles.previewImage}>
              <img className={blogStyles.containerFitImage} src={preview.previewImageSrc} />
            </div>
            <div className={blogStyles.previewText}>
              <label>{preview.previewText}</label>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

Blog.getInitialProps = async function() {
  const res = await getBlogPreviewsAsync();
  console.log("Got Data", res);
  return {
    previews: res.previews
  };
};
