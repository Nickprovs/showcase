import select from "../../styles/select.module.css";

export default function Select(props) {
  const { className, text, isSelected, ...rest } = props;

  if (isSelected) mainButtonClasses += select.dropbtnSelected + " ";
  return (
    <select {...rest} className={select.input}>
      {props.children}
    </select>
  );
}
