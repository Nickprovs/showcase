import Layout from "../../components/layout";

export default function Contact() {
  return (
    <Layout>
      <h1 className="mainContentTitle">Photo</h1>

      <div style={{ width: "50vw", height: "50vh" }} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <a
          style={{ width: "50vw", height: "50vh" }}
          data-flickr-embed="true"
          data-context="true"
          href="https://www.flickr.com/photos/186871940@N02/49513802168/in/album-72157713047888003/"
          title="wt2zylestrkprrd2l6cxolh7geo12t0o"
        >
          <img
            src="https://live.staticflickr.com/65535/49513802168_90131fc81e_c.jpg"
            style={{ width: "50vw", height: "50vh" }}
            alt="wt2zylestrkprrd2l6cxolh7geo12t0o"
          />
        </a>
        <script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
      </div>
    </Layout>
  );
}
