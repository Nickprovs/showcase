import basicButton from "../../../styles/basicButton.module.css";

export default function BasicButton(props) {
  const { children, className, ...rest } = props;

  return (
    <button {...rest} className={basicButton.basicButton + " " + className}>
      {children}
    </button>
  );
}
