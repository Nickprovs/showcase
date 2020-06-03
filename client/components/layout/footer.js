import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransparentButton from "../common/button/transparentButton";
import footer from "../../styles/layout/footer.module.css";

export default function Footer(props) {
  const { externalPages, footnote } = props;

  const externalPageListStyle = {
    listStyleType: "none",
  };

  const externalPageListItemStyle = {
    paddingRight: "25px",
    display: "inline",
  };

  return (
    <div>
      <div className={footer.footer}>
        <ul style={externalPageListStyle}>
          {externalPages.map((item) => (
            <li style={externalPageListItemStyle} key={item.label}>
              <a href={item.href}>
                <TransparentButton>
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
    </div>
  );
}
