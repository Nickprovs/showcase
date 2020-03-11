import select from "../../styles/select.module.css";

export default function Select(props) {
  const { className, path, text, isSelected, children, ...rest } = props;

  let childrenArray = children ? children : [];
  if (isSelected) mainButtonClasses += select.dropbtnSelected + " ";
  return (
    <select {...rest} className={select.input}>
      {childrenArray.map(c => (
        <option key={path ? c[path] : c}>{path ? c[path] : c}</option>
      ))}
    </select>
  );
}
