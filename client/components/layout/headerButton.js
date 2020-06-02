import headerButton from "../../styles/headerButton.module.css";

export default function HeaderButton(props) {
  const { children, className, isSelected, ...rest } = props;
  let classes = headerButton.headerButton + " ";
  if (isSelected) classes += headerButton.headerButtonSelected + " ";

  return (
    <button className={classes + className} {...rest}>
      {children}
    </button>
  );
}
