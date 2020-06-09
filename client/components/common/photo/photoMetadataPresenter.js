import photoMetadataPresenterStyles from "../../../styles/common/photo/photoMetadataPresenter.module.css";
import TagsPresenter from "../misc/tagPresenter";

export default function PhotoMetadataPresenter(props) {
  const { metadata, classes, ...rest } = props;

  return (
    <div className={photoMetadataPresenterStyles.container}>
      {metadata.title && <label className={photoMetadataPresenterStyles.entry}>{metadata.title}</label>}
      {metadata.description && <label className={photoMetadataPresenterStyles.entry}>{metadata.description}</label>}
      {metadata.addressableHighlights && metadata.addressableHighlights.length > 0 && (
        <div className={photoMetadataPresenterStyles.links}>
          {metadata.addressableHighlights.map((addressableHighlight) => (
            <a
              key={addressableHighlight.label}
              style={{ marginLeft: "10px", marginRight: "10px", color: "var(--s1)" }}
              target="_blank"
              href={addressableHighlight.address}
            >
              {addressableHighlight.label}
            </a>
          ))}
        </div>
      )}
      {metadata.tags && <TagsPresenter className={classes && classes.tags} optionalUrl={"/showcase/photo"} tags={metadata.tags} />}
    </div>
  );
}
