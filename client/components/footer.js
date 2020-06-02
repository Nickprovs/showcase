import Icon from "./common/misc/icon";
import TransparentButton from "./common/button/transparentButton";
import footer from "../styles/footer.module.css";

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
                  <Icon className={item.iconClasses}></Icon>
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
