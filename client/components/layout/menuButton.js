import menuButton from "../../styles/layout/menuButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function MenuButton(props) {
  const { children, className, ...rest } = props;

  if (children) content = children;
  return (
    <button className={menuButton.menuButton + " " + className} {...rest}>
      <div className={menuButton.menuButtonContentContainer}>
        <FontAwesomeIcon style={{ marginRight: "5px" }} size="1x" icon={faBars} />
        <span>MENU</span>
      </div>
    </button>
  );
}
