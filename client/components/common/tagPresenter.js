import tagsPresenterStyles from "../../styles/tagsPresenter.module.css";
import BasicButton from "./basicButton";
import Link from "next/link";

export default function TagPresenter(props) {
  const { tags, optionalUrl, optionalQueryText, ...rest } = props;

  let url = optionalUrl ? optionalUrl : "";
  let queryText = optionalQueryText ? optionalQueryText : "search";

  return (
    <div className={tagsPresenterStyles.container}>
      {tags.map((tag) => (
        <Link href={`${url}?${queryText}=${tag}`} key={tag}>
          <a>
            <BasicButton style={{ height: "25px", margin: "5px" }}>{tag.toUpperCase()}</BasicButton>
          </a>
        </Link>
      ))}
    </div>
  );
}
