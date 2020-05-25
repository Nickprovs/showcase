import dateModifiedPresenterStyles from "../../styles/dateModifiedPresenter.module.css";

export default function DateModifiedPresenter(props) {
  const { postedDate, modifiedDate, className, ...rest } = props;

  let postedDateObj = new Date(postedDate);
  let modifiedDateObj = new Date(modifiedDate);
  let shouldRender = true;
  if (modifiedDateObj <= postedDateObj) shouldRender = false;

  let formattedModifiedDateString = modifiedDateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    shouldRender && (
      <div className={dateModifiedPresenterStyles.container}>
        <label className={dateModifiedPresenterStyles.label}>Modified on {formattedModifiedDateString}</label>
      </div>
    )
  );
}
