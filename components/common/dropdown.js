import dropdown from "../../styles/dropdown.module.css";

export default function Dropdown(props) {
  const { className, text, ...rest } = props;
  return (
    <div className={dropdown.dropdown}>
      <button className={dropdown.dropbtn}>{text}</button>
      <div className={dropdown.dropdownContent}>{props.children}</div>
    </div>
  );
}
