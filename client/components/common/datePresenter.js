import datePresenterStyles from "../../styles/datePresenter.module.css";

export default function DatePresenter(props) {
  const { date, withLines, children, className, ...rest } = props;

  let dateObj = new Date(date);
  var options = { year: "numeric", month: "long", day: "numeric" };
  let formattedDateString = dateObj.toLocaleDateString("en-US", options); // 9/17/2016

  let lines = withLines !== undefined ? withLines : true;

  return (
    <div className={datePresenterStyles.container}>
      {lines && <div className={datePresenterStyles.border} />}
      <label className={datePresenterStyles.label}>{formattedDateString}</label>
      {lines && <div className={datePresenterStyles.border} />}
    </div>
  );
}
