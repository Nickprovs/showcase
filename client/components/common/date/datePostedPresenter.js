import datePostedPresenterStyles from "../../../styles/common/date/datePostedPresenter.module.css";

export default function DatePostedPresenter(props) {
  const { date, isModified, withLines, children, className, ...rest } = props;

  let dateObj = new Date(date);
  let formattedDateString = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  let lines = withLines !== undefined ? withLines : true;

  return (
    <div className={datePostedPresenterStyles.container}>
      {lines && <div className={datePostedPresenterStyles.border} />}
      <label className={datePostedPresenterStyles.label}>{formattedDateString}</label>
      {lines && <div className={datePostedPresenterStyles.border} />}
    </div>
  );
}
