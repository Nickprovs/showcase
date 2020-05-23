import datePresenterStyles from "../../styles/datePresenter.module.css";

export default function DatePresenter(props) {
  const { date, children, className, ...rest } = props;

  let dateObj = new Date(date);
  var options = { year: "numeric", month: "long", day: "numeric" };
  let formattedDateString = dateObj.toLocaleDateString("en-US", options); // 9/17/2016

  return (
    <div className={datePresenterStyles.container}>
      <div className={datePresenterStyles.border} />
      <label className={datePresenterStyles.label}>{formattedDateString}</label>
      <div className={datePresenterStyles.border} />
    </div>
  );
}
