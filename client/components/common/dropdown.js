import dropdown from "../../styles/dropdown.module.css";

export default function Dropdown(props) {
  const { className, text, isSelected, ...rest } = props;

  let mainButtonClasses = dropdown.dropbtn + " ";
  if (isSelected) mainButtonClasses += dropdown.dropbtnSelected + " ";

  return (
    <div className={dropdown.dropdown}>
      <button className={mainButtonClasses}>{text}</button>
      <div className={dropdown.dropdownContent}>{props.children}</div>
    </div>
  );
}
