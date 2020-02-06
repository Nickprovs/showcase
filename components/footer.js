import Icon from "./common/icon";
import TransparentButton from "./common/transparentButton";
import footer from "../styles/footer.module.css";

export default function Footer(props) {
  const { externalPages } = props;

  const externalPageListStyle = {
    listStyleType: "none"
  };

  const externalPageListItemStyle = {
    paddingRight: "25px",
    display: "inline"
  };

  return (
    <div>
      <div className={footer.footer}>
        <ul style={externalPageListStyle}>
          {externalPages.map(item => (
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
        <label className={footer.copyright}>© NICHOLAS PROVOST | BUILT BY NICHOLAS PROVOST | INSPIRED BY @AJLKN</label>
      </div>
    </div>
  );
}
