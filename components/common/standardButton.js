import standardButton from "../../styles/standardButton.module.css";

export default function StandardButton(props) {
  const { children, ...rest } = props;
  return (
    <button {...rest} className={standardButton.standardButton}>
      {children}
    </button>
  );
}
