import Layout from "../components/layout";
import { getBlogPreviewsAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import BasicButton from "../components/common/basicButton";
import Pagination from "../components/common/pagination";

const pageSize = 6;

export default function Blog(props) {
  const { previews, currentPage, totalBlogsCount } = props;

  console.log("current page via client", currentPage);

  return (
    <Layout>
      <div className={blogStyles.container}>
        {previews.map(preview => (
          <div className={blogStyles.item}>
            <div className={blogStyles.previewTitle}>
              <h2>{preview.title}</h2>
            </div>
            <div className={blogStyles.previewImage}>
              <img className={blogStyles.containerFitImage} src={preview.image} />
            </div>
            <div className={blogStyles.description}>
              <label>{preview.description}</label>
            </div>
          </div>
        ))}
      </div>
      <div className={blogStyles.paginationContainer}>
        <Pagination itemsCount={totalBlogsCount} pageSize={pageSize} currentPage={currentPage} />
      </div>
    </Layout>
  );
}

Blog.getInitialProps = async function(context) {
  let currentPage = 1;
  if (context.query.page) currentPage = parseInt(context.query.page);

  const getOptions = {
    offset: (currentPage - 1) * pageSize,
    limit: pageSize
  };

  const res = await getBlogPreviewsAsync(getOptions);

  return {
    previews: res.previews,
    currentPage: currentPage,
    totalBlogsCount: res.total
  };
};
