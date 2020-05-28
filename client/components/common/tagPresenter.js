import tagsPresenterStyles from "../../styles/tagsPresenter.module.css";
import BasicButton from "./basicButton";
import Link from "next/link";

export default function TagPresenter(props) {
  const { tags, className, optionalUrl, optionalQueryText, ...rest } = props;

  let url = optionalUrl ? optionalUrl : "";
  let queryText = optionalQueryText ? optionalQueryText : "search";
  let additionaClassName = className ? className : "";

  return (
    <div className={tagsPresenterStyles.container + " " + additionaClassName}>
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
