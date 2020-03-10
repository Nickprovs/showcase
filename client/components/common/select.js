import select from "../../styles/select.module.css";

export default function Select(props) {
  const { className, text, isSelected, children, ...rest } = props;

  if (isSelected) mainButtonClasses += select.dropbtnSelected + " ";
  return (
    <select {...rest} className={select.input}>
      {children.map(c => (
        <option key={c}>{c}</option>
      ))}
    </select>
  );
}
