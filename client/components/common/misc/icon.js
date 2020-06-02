import icon from "../../../styles/common/misc/icon.module.css";

export default function Icon(props) {
  const { className, ...rest } = props;
  return <i className={icon.icon + " withCircle " + className} {...rest}></i>;
}
