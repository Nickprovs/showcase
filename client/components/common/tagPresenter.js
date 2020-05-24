import tagsPresenterStyles from "../../styles/tagsPresenter.module.css";
import BasicButton from "./basicButton";
import Link from "next/link";

export default function TagPresenter(props) {
  const { tags, ...rest } = props;

  return (
    <div className={tagsPresenterStyles.container}>
      {tags.map((tag) => (
        <Link href={`?search=${tag}`} key={tag}>
          <a>
            <BasicButton style={{ height: "25px", margin: "5px" }}>{tag}</BasicButton>
          </a>
        </Link>
      ))}
    </div>
  );
}
