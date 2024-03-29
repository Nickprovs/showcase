import tagsPresenterStyles from "../../../styles/common/misc/tagsPresenter.module.css";
import BasicButton from "../button/basicButton";
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
            <BasicButton style={{ height: "25px", margin: "5px" }}>{tag.toUpperCase()}</BasicButton>
        </Link>
      ))}
    </div>
  );
}
