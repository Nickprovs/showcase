import headerDropdown from "../../styles/layout/headerDropdown.module.css";

export default function HeaderDropdown(props) {
  const { className, text, isSelected, ...rest } = props;

  let mainButtonClasses = headerDropdown.dropbtn + " ";
  if (isSelected) mainButtonClasses += headerDropdown.dropbtnSelected + " ";

  return (
    <div className={headerDropdown.dropdown}>
      <button className={mainButtonClasses}>{text}</button>
      <div className={headerDropdown.dropdownContent}>{props.children}</div>
    </div>
  );
}
