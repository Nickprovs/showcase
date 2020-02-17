import transparentButton from "../../styles/transparentButton.module.css";

export default function TransparentButton(props) {
  const { children, className, ...rest } = props;

  return (
    <button {...rest} className={transparentButton.transparentButton + " " + className}>
      {children}
    </button>
  );
}
