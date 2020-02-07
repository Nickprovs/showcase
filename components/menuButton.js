import Icon from "./common/icon";
import menuButton from "../styles/menuButton.module.css";

export default function MenuButton(props) {
  const { children, className, ...rest } = props;

  if (children) content = children;
  return (
    <button className={menuButton.menuButton + " " + className} {...rest}>
      <div className={menuButton.menuButtonContentContainer}>
        <Icon className={`${menuButton.hamburgerIcon} fas fa-bars`} />
        <span>MENU</span>
      </div>
    </button>
  );
}
