import icon from "../../styles/icon.module.css";

export default function Icon(props) {
  const { className, ...rest } = props;
  return <i className={icon.icon + " withCircle " + className} {...rest}></i>;
}
