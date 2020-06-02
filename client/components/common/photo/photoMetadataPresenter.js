import photoMetadataPresenterStyles from "../../../styles/common/photo/photoMetadataPresenter.module.css";
import TagsPresenter from "../misc/tagPresenter";
export default function PhotoMetadataPresenter(props) {
  const { metadata, classes, ...rest } = props;

  return (
    <div className={photoMetadataPresenterStyles.container}>
      {metadata.title && <label className={photoMetadataPresenterStyles.entry}>{metadata.title}</label>}
      {metadata.description && <label className={photoMetadataPresenterStyles.entry}>{metadata.description}</label>}
      {metadata.tags && <TagsPresenter className={classes && classes.tags} optionalUrl={"/showcase/photo"} tags={metadata.tags} />}
    </div>
  );
}
