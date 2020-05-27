import photoMetadataPresenterStyles from "../../styles/photoMetadataPresenter.module.css";
import TagsPresenter from "./tagPresenter";
export default function PhotoMetadataPresenter(props) {
  const { metadata, ...rest } = props;

  return (
    <div className={photoMetadataPresenterStyles.container}>
      {metadata.title && <label className={photoMetadataPresenterStyles.entry}>Title: {metadata.title}</label>}
      {metadata.description && <label className={photoMetadataPresenterStyles.entry}>Description: {metadata.description}</label>}
      {metadata.tags && (
        <span>
          <label className={photoMetadataPresenterStyles.entry}>Tags:</label>
          <TagsPresenter optionalUrl={"/showcase/photo"} tags={metadata.tags} />
        </span>
      )}
    </div>
  );
}
