import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransparentButton from "../common/button/transparentButton";import footer from "../../styles/layout/footer.module.css";
import { faLightbulb as fasLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";

export default function Footer(props) {
  const { externalPages, footnote, onToggleTheme, darkModeOn } = props;

  const externalPageListStyle = {
    margin: "0px",
    listStyleType: "none",
  };

  const externalPageListItemStyle = {
    paddingRight: "25px",
    display: "inline",
  };

  return (
    <footer>
      <div className={footer.footer}>
        <ul style={externalPageListStyle}>
          <li style={externalPageListItemStyle} key="themeToggle">
            <TransparentButton aria-label="Toggle Theme" onClick={() => onToggleTheme()}>
              <FontAwesomeIcon size="2x" icon={darkModeOn ? farLightbulb : fasLightbulb} />
            </TransparentButton>
          </li>
          {externalPages.map((item) => (
            <li style={externalPageListItemStyle} key={item.label}>
              <a rel="noopener" target="_blank" href={item.href}>
                <TransparentButton aria-label={item.label}>
                  <FontAwesomeIcon size="2x" icon={item.icon}></FontAwesomeIcon>
                </TransparentButton>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={footer.copyrightContainer}>
        <label className={footer.copyright}>{footnote}</label>
      </div>
    </footer>
  );
}
