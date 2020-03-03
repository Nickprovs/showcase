import Layout from "../components/layout";
import { getBlogPreviewsAsync } from "../services/blogService";
import blogStyles from "../styles/blog.module.css";
import Input from "../components/common/input";
import Pagination from "../components/common/pagination";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const pageSize = 6;

export default function Blog(props) {
  const { previews, currentPage, totalBlogsCount } = props;

  console.log("current page via client", currentPage);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const search = e => {
    e.preventDefault();
    console.log(searchText);
    router.push({
      pathname: router.pathname,
      query: { search: searchText }
    });
  };

  const handleTextChange = e => {
    setSearchText(e.target.value);
    router.push({
      pathname: router.pathname,
      query: { search: e.target.value }
    });
  };

  return (
    <Layout>
      <form onSubmit={e => search(e)}>
        <Input
          onChange={e => handleTextChange(e)}
          value={searchText}
          placeholder="Search..."
          style={{ width: "30%", marginLeft: "20px" }}
        />
      </form>
      <div className={blogStyles.container}>
        {previews.map(preview => (
          <div key={preview.slug} className={blogStyles.item}>
            <div className={blogStyles.previewTitle}>
              <Link href="/blog/[slug]" as={`/blog/${preview.slug}`}>
                <a className="clickableHeading">{preview.title}</a>
              </Link>
            </div>
            <div className={blogStyles.previewImage}>
              <Link href="/blog/[slug]" as={`/blog/${preview.slug}`}>
                <a>
                  <img className={blogStyles.containerFitImage} src={preview.image} />
                </a>
              </Link>
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
  let search = "";

  if (context.query.page) currentPage = parseInt(context.query.page);
  if (context.query.search) search = context.query.search;

  const getOptions = {
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    search: search
  };

  const res = await getBlogPreviewsAsync(getOptions);

  return {
    previews: res.items,
    currentPage: currentPage,
    totalBlogsCount: res.total
  };
};
