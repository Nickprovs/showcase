import Link from "next/link";
import header from "../styles/header.module.css";

const menuStyle = {
  margin: "0px",
  padding: "0px",
  height: "100%"
};

const menuItemStyle = {
  display: "inline"
};

const buttonStyle = {
  width: "100px",
  height: "100%"
};

export default function Header(props) {
  const { internalPages, externalPages } = props;

  const externalPageListStyle = {
    listStyleType: "none"
  };

  const externalPageListItemStyle = {
    paddingRight: "25px",
    display: "inline"
  };

  const externalPageIconStyle = {
    fontSize: "25px"
  };

  return (
    <div className={header.header}>
      {/* Internal Links*/}
      <div className={header.leftContent}>
        <ul style={menuStyle}>
          {internalPages.map(item => (
            <li style={menuItemStyle} key={item.label}>
              <Link href={item.href}>
                <a>
                  <button style={buttonStyle}>{item.label}</button>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* External Links*/}
      <div className={header.rightContent}>
        <ul style={externalPageListStyle}>
          {externalPages.map(item => (
            <li style={externalPageListItemStyle} key={item.label}>
              <a href={item.href}>
                <i style={externalPageIconStyle} className={item.iconClasses}></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
