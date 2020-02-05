import standardButton from "../../styles/standardButton.module.css";

export default function StandardButton(props) {
  const { children, className, ...rest } = props;

  return (
    <button {...rest} className={standardButton.standardButton + " " + className}>
      {children}
    </button>
  );
}
